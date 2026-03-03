import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 375;

function normalize(size: number): number {
    const newSize = size * scale;
    const roundedSize = Platform.OS == 'ios'
        ? Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
        : Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    return roundedSize;
}

const iosFonts = {
    REGULAR: 'FunnelDisplay-Regular',
    MEDIUM: 'FunnelDisplay-Medium',
    BOLD: 'FunnelDisplay-Bold'
};

const androidFonts = {
    REGULAR: 'FunnelDisplay-Regular',
    MEDIUM: 'FunnelDisplay-Medium',
    BOLD: 'FunnelDisplay-Bold'
};

export const Fonts = {
    ...(Platform.OS == 'ios' ? iosFonts : androidFonts),
};

export const FontSize = {
    _40: normalize(40),
    _33: normalize(33),
    _32: normalize(32),
    _30: normalize(30),
    _28: normalize(28),
    _26: normalize(26),
    _25: normalize(25),
    _24: normalize(24),
    _23: normalize(23),
    _22: normalize(22),
    _21: normalize(21),
    _20: normalize(20),
    _18: normalize(18),
    _16: normalize(16),
    _15: normalize(15),
    _14: normalize(14),
    _13: normalize(13),
    _12: normalize(12),
    _11: normalize(11),
    _10: normalize(10),
    _8: normalize(8),
    _7: normalize(7),
    _6: normalize(6)

};
