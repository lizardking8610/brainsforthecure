<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitcf87f89295679352abe450fddf326efa
{
    public static $prefixLengthsPsr4 = array (
        'o' => 
        array (
            'oldmine\\RelativeToAbsoluteUrl\\Tests\\' => 36,
            'oldmine\\RelativeToAbsoluteUrl\\' => 30,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'oldmine\\RelativeToAbsoluteUrl\\Tests\\' => 
        array (
            0 => __DIR__ . '/..' . '/oldmine/relative-to-absolute-url/tests',
        ),
        'oldmine\\RelativeToAbsoluteUrl\\' => 
        array (
            0 => __DIR__ . '/..' . '/oldmine/relative-to-absolute-url/src',
        ),
    );

    public static $prefixesPsr0 = array (
        'K' => 
        array (
            'KubAT\\PhpSimple\\HtmlDomParser' => 
            array (
                0 => __DIR__ . '/..' . '/kub-at/php-simple-html-dom-parser/src',
            ),
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitcf87f89295679352abe450fddf326efa::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitcf87f89295679352abe450fddf326efa::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInitcf87f89295679352abe450fddf326efa::$prefixesPsr0;

        }, null, ClassLoader::class);
    }
}
