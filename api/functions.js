module.exports = {
    gamemodesReplacer: (int) => {
        if(int === 0) return 'osu';
        if(int === 1) return 'taiko';
        if(int === 2) return 'catch';
        if(int === 3) return 'mania';
        return 'osu';
    }
};