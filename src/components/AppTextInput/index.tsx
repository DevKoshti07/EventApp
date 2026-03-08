import React, { forwardRef, useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    Image,
    StyleSheet,
    StyleProp,
    ViewStyle,
} from 'react-native'
import { AppColors } from '../../theme/AppColors'
import { Fonts, FontSize } from '../../assets/fonts'
import { Icons } from '../../assets/icons'
import { AppShadow } from '../../constants/commonStyle'

interface AppTextInputProps extends TextInputProps {
    label?: string
    isPassword?: boolean
    containerStyle?: StyleProp<ViewStyle>
    error?: string
}

const AppTextInput = forwardRef<TextInput, AppTextInputProps>((props, ref) => {
    const {
        label,
        isPassword = false,
        containerStyle,
        error,
        style,
        ...rest
    } = props

    const [showPassword, setShowPassword] = useState(false)

    return (
        <View style={[styles.wrapper, containerStyle]}>
            {label ? (
                <Text style={styles.label}>{label}</Text>
            ) : null}

            <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
                <TextInput
                    ref={ref}
                    style={[styles.input, style]}
                    placeholderTextColor="#999"
                    secureTextEntry={isPassword && !showPassword}
                    autoCapitalize={isPassword ? 'none' : rest.autoCapitalize}
                    {...rest}
                />

                {isPassword ? (
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(prev => !prev)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Image
                            source={showPassword ? Icons.icnEyeShow : Icons.icnEyeHide}
                            style={styles.eyeIcon}
                        />
                    </TouchableOpacity>
                ) : null}
            </View>

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}
        </View>
    )
})

AppTextInput.displayName = 'AppTextInput'

export default AppTextInput

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    label: {
        fontSize: FontSize._14,
        fontFamily: Fonts.MEDIUM,
        color: '#666',
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        backgroundColor: '#f8f8f8',
        ...AppShadow,
    },
    inputRowError: {
        borderColor: AppColors.warningRed,
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: FontSize._14,
        fontFamily: Fonts.REGULAR,
        color: AppColors.basicBlack,
    },
    eyeButton: {
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    eyeIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#999',
    },
    errorText: {
        fontSize: FontSize._12,
        fontFamily: Fonts.REGULAR,
        color: AppColors.warningRed,
        marginTop: 4,
    },
})
