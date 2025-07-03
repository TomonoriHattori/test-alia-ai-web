var MpFS = {
    prepareResource: (function (dir) {
        FS.createFolder(
            '/',
            '/temp',
            true,
            true
        );
        FS.createPath(
            '/',
            '/items',
            true,
            false
        );
        FS.createPreloadedFile(
            '/items',
            "ainyan.bin",
            MpConfig["documentPath"] + '/items/ainyan.bin',
            true,
            false
        );
    }),
};
