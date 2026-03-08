import {
    StyleSheet, Text, View, TouchableOpacity, Image,
    StatusBar, ActivityIndicator, KeyboardAvoidingView,
    ScrollView, Platform
} from 'react-native'
import React, { useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppColors } from '../../../theme/AppColors'
import { AppMargin, WindowHeight } from '../../../constants/commonStyle'
import { Fonts, FontSize } from '../../../assets/fonts'
import { Images } from '../../../assets/images'
import { Icons } from '../../../assets/icons'
import { NavAction } from '../../../utils/navigationService'
import { navigationKeys } from '../../../constants/navigationKeys'
import { APIMethods } from '../../../services/API/methods'
import APIendPoints from '../../../services/API/endpoints'
import { _showToast } from '../../../services/UIs/toastConfig'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setIsLogin, setUserData } from '../../../store/reducers/authSlice'
import AppTextInput from '../../../components/AppTextInput'

export default function LoginScreen() {

    const dispatch = useAppDispatch();
    const passwordRef = useRef<TextInput>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateAndLogin = () => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedEmail) {
            _showToast('Please enter your email', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            _showToast('Please enter a valid email address', 'error');
            return;
        }

        if (!trimmedPassword) {
            _showToast('Please enter your password', 'error');
            return;
        }

        if (trimmedPassword.length < 6) {
            _showToast('Password must be at least 6 characters', 'error');
            return;
        }

        apiLogin({ email: trimmedEmail, password: trimmedPassword });
    };

    const apiLogin = async (loginParams: any) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('email', loginParams.email);
            formData.append('password', loginParams.password);

            const response: any = await APIMethods.post(APIendPoints.LOGIN, formData);
            console.log('[ Login Response ] >>>>', response);

            const statusCode = response?.statusCode ?? response?.StatusCode ?? response?.status;
            if (statusCode == 200) {
                dispatch(setUserData(response?.result ?? null));
                dispatch(setIsLogin(true));
                _showToast('Login Success', 'success');

                setTimeout(() => {
                    NavAction.reset(0, [{ name: navigationKeys.BottomTabNavigator }]);
                }, 1000);
            } else {
                _showToast(response?.data?.message ?? response?.message ?? 'Login failed. Please try again.', 'error');
            }
        } catch (error) {
            console.log(error);
            _showToast('Something went wrong. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.basicWhite} />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View style={styles.topContainer}>
                        <Text style={styles.appTitle}>Plie</Text>
                        <Image source={Images.imgPicture} style={styles.imgStyle} />
                    </View>

                    <View style={styles.contentContainer}>
                        <AppTextInput
                            label="Email"
                            placeholder="email@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                            value={email}
                            onChangeText={setEmail}
                            onSubmitEditing={() => passwordRef.current?.focus()}
                        />

                        <AppTextInput
                            ref={passwordRef}
                            label="Password"
                            placeholder="Password"
                            isPassword
                            returnKeyType="done"
                            containerStyle={styles.passwordContainer}
                            value={password}
                            onChangeText={setPassword}
                            onSubmitEditing={validateAndLogin}
                        />

                        <TouchableOpacity style={styles.forgotPasswordContainer}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.signInContainer, isLoading && styles.signInContainerDisabled]}
                            onPress={validateAndLogin}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? <ActivityIndicator color="#fff" size="small" />
                                : <Text style={styles.signInText}>Sign In</Text>
                            }
                        </TouchableOpacity>

                        <View style={styles.signUpContainer}>
                            <Text style={styles.signUpText}>Not a member? </Text>
                            <TouchableOpacity>
                                <Text style={styles.signUpLink}>Sign Up Here</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or Sign In with:</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Image source={Icons.icnGoogle} style={styles.socialIconImage} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Image source={Icons.icnApple} style={styles.socialIconImage} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Image source={Icons.icnFacebook} style={styles.socialIconImage} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.basicWhite,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    topContainer: {
        backgroundColor: AppColors.basicGray,
        height: WindowHeight / 3,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: AppMargin._40,
    },
    appTitle: {
        fontSize: FontSize._40,
        fontFamily: Fonts.BOLD,
        color: AppColors.basicBlack,
        textAlign: 'center',
    },
    imgStyle: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: AppMargin._50,
        paddingTop: AppMargin._20,
        paddingBottom: AppMargin._40,
    },
    passwordContainer: {
        marginTop: AppMargin._20,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: AppMargin._20,
        marginTop: AppMargin._10,
    },
    forgotPasswordText: {
        color: AppColors.basicBlack,
        fontSize: FontSize._12,
        fontFamily: Fonts.MEDIUM,
    },
    signInContainer: {
        backgroundColor: AppColors.primary100,
        borderRadius: 4,
        paddingVertical: AppMargin._10,
        paddingHorizontal: AppMargin._30,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: AppMargin._20,
    },
    signInContainerDisabled: {
        opacity: 0.7,
    },
    signInText: {
        color: '#fff',
        fontSize: FontSize._16,
        fontFamily: Fonts.MEDIUM,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: AppMargin._20,
    },
    signUpText: {
        color: AppColors.basicBlack,
        fontSize: FontSize._12,
        fontFamily: Fonts.MEDIUM,
    },
    signUpLink: {
        color: AppColors.primary100,
        fontSize: FontSize._12,
        fontFamily: Fonts.MEDIUM,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        color: '#666',
        fontSize: FontSize._14,
        fontFamily: Fonts.MEDIUM,
        marginHorizontal: 10,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIconImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
})
