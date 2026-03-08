import React, { useEffect, useState, useCallback } from 'react'
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    Share,
} from 'react-native'
import { AppColors } from '../../theme/AppColors'
import { Fonts, FontSize } from '../../assets/fonts'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { setEvents, toggleEventFavourite, EventItem } from '../../store/reducers/homeScreenDataSlice'
import { APIMethods } from '../../services/API/methods'
import APIendPoints from '../../services/API/endpoints'

const formatDateRange = (item: EventItem): string => {
    if (item.start_date && item.end_date && item.start_date !== item.end_date) {
        return `${item.start_date} – ${item.end_date}`
    }
    if (item.start_date && item.start_time) {
        return `${item.start_date} @${item.start_time}`
    }
    if (item.start_date) return item.start_date
    return item.date ?? ''
}

const formatPrice = (item: EventItem): string => {
    if (item.min_price != null && item.max_price != null) {
        return `€${item.min_price} – €${item.max_price}`
    }
    if (item.min_price != null) return `€${item.min_price}`
    if (item.price) return item.price
    return ''
}

const formatLocation = (item: EventItem): string => {
    if (item.city && item.country) return `${item.city}, ${item.country}`
    if (item.city) return item.city
    if (item.country) return item.country
    return item.location ?? ''
}

interface EventCardProps {
    item: EventItem
    onFavourite: (id: number | string) => void
    onShare: (item: EventItem) => void
}

function EventCard({ item, onFavourite, onShare }: EventCardProps) {
    const dateStr = formatDateRange(item)
    const priceStr = formatPrice(item)
    const locationStr = formatLocation(item)
    const styles_tags: string[] = item.styles?.map((s: any) => s.name ?? s) ?? []
    if (item.type && !styles_tags.includes(item.type)) styles_tags.unshift(item.type)
    if (item.category && !styles_tags.includes(item.category)) styles_tags.unshift(item.category)

    const imageUri = item.banner_image || item.image

    return (
        <View style={cardStyles.card}>

            <TouchableOpacity style={cardStyles.arrowButton}>
                <Text style={cardStyles.arrowText}>→</Text>
            </TouchableOpacity>

            <View style={cardStyles.row}>

                <View style={cardStyles.imageWrapper}>
                    {imageUri ? (
                        <Image
                            source={{ uri: imageUri }}
                            style={cardStyles.image}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={[cardStyles.image, cardStyles.imagePlaceholder]}>
                            <Text style={cardStyles.imagePlaceholderText}>
                                {(item.title ?? '?')[0].toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={cardStyles.content}>
                    <Text style={cardStyles.title} numberOfLines={2}>{item.title}</Text>
                    {dateStr ? (
                        <Text style={cardStyles.date}>{dateStr}</Text>
                    ) : null}
                    {priceStr ? (
                        <Text style={cardStyles.price}>{priceStr}</Text>
                    ) : null}

                    <View style={cardStyles.tagsRow}>
                        {styles_tags.slice(0, 4).map((tag, idx) => (
                            <View key={idx} style={cardStyles.tag}>
                                <Text style={cardStyles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={cardStyles.rightCol}>
                    <Text style={cardStyles.location} numberOfLines={2}>{locationStr}</Text>
                    <View style={cardStyles.actions}>
                        <TouchableOpacity onPress={() => onShare(item)} style={cardStyles.actionBtn}>
                            <Text style={cardStyles.shareIcon}>⬆</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onFavourite(item.id)} style={cardStyles.actionBtn}>
                            <Text style={[cardStyles.heartIcon, item.isFavourite && cardStyles.heartActive]}>
                                {item.isFavourite ? '♥' : '♡'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default function EventList() {
    const dispatch = useAppDispatch()
    const events = useAppSelector(state => state.homeScreenData.events)
    const userData = useAppSelector(state => state.auth.userData)

    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const userName = userData?.name ?? userData?.full_name ?? 'there'

    const fetchEvents = useCallback(async (isRefresh = false) => {
        if (isRefresh) setIsRefreshing(true)
        else setIsLoading(true)
        setError(null)

        try {
            const token = userData?.token ?? userData?.access_token
            const customHeaders: any = token
                ? { Authorization: `Bearer ${token}` }
                : {}

            const response: any = await APIMethods.post(
                APIendPoints.EVENTS_LISTING,
                new FormData(),
                customHeaders
            )

            console.log('[ Events Response ] >>>>', response)

            const statusCode = response?.statusCode ?? response?.StatusCode ?? response?.status
            if (statusCode === 200 || response?.result || response?.data) {
                const raw = response?.result ?? response?.data ?? response
                const list = Array.isArray(raw) ? raw : (raw?.events ?? raw?.data ?? [])
                dispatch(setEvents(list))
            } else {
                setError(response?.message ?? 'Failed to load events.')
            }
        } catch (err) {
            console.log('Events fetch error:', err)
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [userData, dispatch])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    const handleShare = async (item: EventItem) => {
        try {
            await Share.share({ message: `Check out this event: ${item.title}` })
        } catch { }
    }

    const handleFavourite = (id: number | string) => {
        dispatch(toggleEventFavourite(id))
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={styles.header}>
                <Text style={styles.greeting}>Hello {userName}!</Text>
                <Text style={styles.subtitle}>Are you ready to dance?</Text>
            </View>

            <View style={styles.divider} />

            {isLoading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={AppColors.primary100} />
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => fetchEvents()}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <EventCard
                            item={item}
                            onFavourite={handleFavourite}
                            onShare={handleShare}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => fetchEvents(true)}
                            tintColor={AppColors.primary100}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Text style={styles.emptyText}>No events found</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#fff',
    },
    greeting: {
        fontSize: 26,
        fontFamily: Fonts.BOLD,
        color: AppColors.basicBlack,
    },
    subtitle: {
        fontSize: FontSize._14,
        fontFamily: Fonts.REGULAR,
        color: AppColors.black80,
        marginTop: 2,
    },
    divider: {
        height: 8,
        backgroundColor: AppColors.basicGray,
    },
    listContent: {
        paddingVertical: 8,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: FontSize._14,
        fontFamily: Fonts.REGULAR,
        color: AppColors.warningRed,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryBtn: {
        backgroundColor: AppColors.primary100,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontFamily: Fonts.MEDIUM,
        fontSize: FontSize._14,
    },
    emptyText: {
        fontSize: FontSize._14,
        color: AppColors.black80,
        fontFamily: Fonts.REGULAR,
    },
})

const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    arrowButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    arrowText: {
        fontSize: 18,
        color: AppColors.basicBlack,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    imageWrapper: {
        marginRight: 10,
    },
    image: {
        width: 72,
        height: 72,
        borderRadius: 8,
    },
    imagePlaceholder: {
        backgroundColor: AppColors.basicGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        fontSize: 22,
        fontFamily: Fonts.BOLD,
        color: AppColors.black80,
    },
    content: {
        flex: 1,
        paddingRight: 6,
    },
    title: {
        fontSize: FontSize._14,
        fontFamily: Fonts.BOLD,
        color: AppColors.basicBlack,
        marginBottom: 3,
        paddingRight: 20,
    },
    date: {
        fontSize: FontSize._12,
        fontFamily: Fonts.MEDIUM,
        color: AppColors.primary100,
        marginBottom: 2,
    },
    price: {
        fontSize: FontSize._12,
        fontFamily: Fonts.REGULAR,
        color: AppColors.basicBlack,
        marginBottom: 6,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 2,
    },
    tag: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 4,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 10,
        fontFamily: Fonts.REGULAR,
        color: AppColors.basicBlack,
    },
    rightCol: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        minWidth: 80,
        alignSelf: 'stretch',
    },
    location: {
        fontSize: 10,
        fontFamily: Fonts.REGULAR,
        color: AppColors.black80,
        textAlign: 'right',
        marginTop: 20,
        maxWidth: 80,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
    },
    actionBtn: {
        padding: 4,
    },
    shareIcon: {
        fontSize: 16,
        color: AppColors.black80,
    },
    heartIcon: {
        fontSize: 18,
        color: '#ccc',
    },
    heartActive: {
        color: AppColors.primary100,
    },
})