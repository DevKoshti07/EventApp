import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, StatusBar, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppColors } from '../../../theme/AppColors'
import { AppHeight, AppMargin, AppShadow, WindowHeight } from '../../../constants/commonStyle'
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

export default function LoginScreen() {

    const dispatch = useAppDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
            const response: any = await APIMethods.post(APIendPoints.LOGIN, loginParams);
            if (response?.statusCode == 200) {
                dispatch(setUserData(response?.result ?? null));
                dispatch(setIsLogin(true));
                _showToast('Login Success', 'success');

                setTimeout(() => {
                    NavAction.reset(0, [{ name: navigationKeys.BottomTabNavigator }]);
                }, 1000);
            } else {
                _showToast(response?.data?.message ?? 'Login failed. Please try again.', 'error');
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
            <StatusBar />

            <View style={styles.topContainer}>
                <Text style={styles.appTitle}>Plie</Text>
                <Image source={Images.imgPicture} style={styles.imgStyle} />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="email@email.com"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPassword(prev => !prev)}
                        >
                            <Image
                                source={showPassword ? Icons.icnEyeShow : Icons.icnEyeHide}
                                style={styles.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

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
                        <View style={styles.socialIcon}>
                            <Image source={Icons.icnGoogle} style={styles.socialIconImage} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton}>
                        <View style={styles.socialIcon}>
                            <Image source={Icons.icnApple} style={styles.socialIconImage} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton}>
                        <View style={styles.socialIcon}>
                            <Image source={Icons.icnFacebook} style={styles.socialIconImage} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topContainer: {
        backgroundColor: AppColors.basicGray,
        height: WindowHeight / 3,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: AppMargin._40,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: AppMargin._50,
        paddingTop: AppMargin._20,
    },
    appTitle: {
        fontSize: FontSize._40,
        fontFamily: Fonts.BOLD,
        color: '#000',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: FontSize._14,
        fontFamily: Fonts.MEDIUM,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#f8f8f8',
        ...AppShadow
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#666',
        fontSize: FontSize._14,
        fontFamily: Fonts.MEDIUM,
    },
    signInContainer: {
        backgroundColor: AppColors.primary100,
        borderRadius: 25,
        paddingVertical: 14,
        paddingHorizontal: 40,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 130,
        marginBottom: 16,
    },
    signInContainerDisabled: {
        opacity: 0.7,
    },
    signInText: {
        color: '#fff',
        fontSize: FontSize._16,
        fontFamily: Fonts.MEDIUM,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        backgroundColor: '#f8f8f8',
        ...AppShadow,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#000',
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
    eyeIconActive: {
        tintColor: '#333',
    },
    signInButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: FontSize._16,
        fontFamily: Fonts.MEDIUM,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    signUpText: {
        color: '#666',
        fontSize: FontSize._14,
        fontFamily: Fonts.MEDIUM,
    },
    signUpLink: {
        color: '#007AFF',
        fontSize: FontSize._14,
        fontFamily: Fonts.MEDIUM,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
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
    socialIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIconText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#666',
    },
    imgStyle: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    socialIconImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
})
