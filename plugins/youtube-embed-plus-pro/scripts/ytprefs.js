(function (window, $)
{
    window._EPYT_ = window._EPYT_ || {
        ajaxurl: "\/wp-admin\/admin-ajax.php",
        security: "",
        gallery_scrolloffset: 100,
        eppathtoscripts: "\/wp-content\/plugins\/youtube-embed-plus-pro\/scripts\/",
        eppath: "\/wp-content\/plugins\/youtube-embed-plus-pro\/",
        epresponsiveselector: ["iframe.__youtube_prefs_widget__"],
        epdovol: true,
        evselector: 'iframe.__youtube_prefs__[src], iframe[src*="youtube.com/embed/"], iframe[src*="youtube-nocookie.com/embed/"]',
        stopMobileBuffer: true,
        ajax_compat: false,
        usingdefault: true,
        ytapi_load: 'light'
    };

    if (window.location.toString().indexOf('https://') === 0)
    {
        window._EPYT_.ajaxurl = window._EPYT_.ajaxurl.replace("http://", "https://");
    }

    window._EPYT_.pageLoaded = false;
    $(window).on('load._EPYT_', function ()
    {
        window._EPYT_.pageLoaded = true;
    });

    if (!document.querySelectorAll)
    {
        document.querySelectorAll = function (selector)
        {
            var doc = document, head = doc.documentElement.firstChild, styleTag = doc.createElement('STYLE');
            head.appendChild(styleTag);
            doc.__qsaels = [];
            styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsaels.push(this))}";
            window.scrollBy(0, 0);
            return doc.__qsaels;
        };
    }

    if (typeof window._EPADashboard_ === 'undefined')
    {
        window._EPADashboard_ =
                {
                    initStarted: false,
                    checkCount: 0,
                    onPlayerReady: function (event)
                    {
                        try
                        {
                            if (typeof _EPYT_.epdovol !== "undefined" && _EPYT_.epdovol)
                            {
                                var vol = parseInt(event.target.getIframe().getAttribute("data-vol"));
                                if (!isNaN(vol))
                                {
                                    if (vol === 0)
                                    {
                                        event.target.mute();
                                    }
                                    else
                                    {
                                        if (event.target.isMuted())
                                        {
                                            event.target.unMute();
                                        }
                                        event.target.setVolume(vol);
                                    }
                                }
                            }

                            var epautoplay = parseInt(event.target.getIframe().getAttribute("data-epautoplay"));
                            if (!isNaN(epautoplay) && epautoplay === 1)
                            {
                                event.target.playVideo();
                            }

                        }
                        catch (err)
                        {
                        }

                        try
                        {
                            var $ifm = $(event.target.getIframe());
                            if ($ifm.hasClass('epyt-lbif') && $ifm.hasClass('epyt-thumbplay') && $ifm.closest('.lity-content').length)
                            {
                                // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/video/autoplay.js
                                if (!(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) && window._EPYT_.stopMobileBuffer))
                                {
                                    event.target.playVideo();
                                }
                            }
                        }
                        catch (err2)
                        {
                        }


                        setTimeout(function ()
                        {
                            try
                            {
                                var ytid = window._EPADashboard_.justid(event.target.getVideoUrl());
                                window._EPADashboard_.yt_dash("ytid=" + ytid);

                            }
                            catch (err)
                            {
                            }
                        }, 1700);
                    },
                    onPlayerStateChange: function (event)
                    {
                        var ifm = event.target.getIframe();
                        if (event.data === window.YT.PlayerState.PLAYING && event.target.ponce !== true && ifm.src.indexOf('autoplay=1') === -1)
                        {
                            event.target.ponce = true;

                            try
                            {
                                var ytid = window._EPADashboard_.justid(event.target.getVideoUrl());
                                window._EPADashboard_.yt_dash("ytid=" + ytid + "&p=1");

                            }
                            catch (err)
                            {
                            }
                        }
                        
                        if (event.data === window.YT.PlayerState.ENDED && $(ifm).data('relstop') == '1')
                        {
                            event.target.stopVideo();
                        }

                        var $gallery = $(ifm).closest('.epyt-gallery');
                        if (!$gallery.length)
                        {
                            $gallery = $('#' + $(ifm).data('epytgalleryid'));
                        }
                        if ($gallery.length)
                        {
                            var autonext = $gallery.find('.epyt-pagebutton').first().data('autonext') == '1';
                            if (autonext && event.data === window.YT.PlayerState.ENDED)
                            {
                                var $currvid = $gallery.find('.epyt-current-video');
                                if (!$currvid.length)
                                {
                                    $currvid = $gallery.find('.epyt-gallery-thumb').first();
                                }
                                var $nextvid = $currvid.find(' ~ .epyt-gallery-thumb').first();
                                var $lityopen = $('div.lity-wrap[data-lity-close]');
                                if ($nextvid.length)
                                {
                                    if ($lityopen.length)
                                    {
                                        window._EPADashboard_.lb.close();
                                        setTimeout(function ()
                                        {
                                            $nextvid.click();
                                        }, 1000);

                                    }
                                    else
                                    {
                                        $nextvid.click();
                                    }
                                }
                                else
                                {
                                    if ($lityopen.length)
                                    {
                                        window._EPADashboard_.lb.close();
                                        setTimeout(function ()
                                        {
                                            $gallery.find('.epyt-pagebutton.epyt-next[data-pagetoken!=""][data-pagetoken]').first().click();
                                        }, 1000);

                                    }
                                    else
                                    {
                                        $gallery.find('.epyt-pagebutton.epyt-next[data-pagetoken!=""][data-pagetoken]').first().click();
                                    }

                                }
                            }
                        }

                    },
                    justid: function (s)
                    {
                        return new RegExp("[\\?&]v=([^&#]*)").exec(s)[1];
                    },
                    setupevents: function (iframeid)
                    {
                        if (typeof (window.YT) !== 'undefined' && window.YT !== null && window.YT.loaded)
                        {
                            var thisvid = document.getElementById(iframeid);

                            if (!thisvid.epytsetupdone)
                            {
                                window._EPADashboard_.log('Setting up YT API events: ' + iframeid);
                                thisvid.epytsetupdone = true;
                                return new window.YT.Player(iframeid, {
                                    events: {
                                        "onReady": window._EPADashboard_.onPlayerReady,
                                        "onStateChange": window._EPADashboard_.onPlayerStateChange
                                    }
                                });
                            }
                        }
                    },
                    yt_dash: function (q)
                    {
                        if (window._EPYT_.dshpre)
                        {
                            $.post(_EPYT_.ajaxurl, {
                                action: 'my_embedplus_yt_dash',
                                security: _EPYT_.security,
                                qstring: "es=w&u=" + encodeURIComponent(window.location.href.split("#")[0]) + "&" + q
                            });
                        }
                    },
                    apiInit: function ()
                    {
                        if (typeof (window.YT) !== 'undefined')
                        {
                            window._EPADashboard_.initStarted = true;
                            var __allytifr = document.querySelectorAll(_EPYT_.evselector);
                            for (var i = 0; i < __allytifr.length; i++)
                            {
                                if (!__allytifr[i].hasAttribute("id"))
                                {
                                    __allytifr[i].id = "_dytid_" + Math.round(Math.random() * 8999 + 1000);
                                }
                                window._EPADashboard_.setupevents(__allytifr[i].id);
                            }
                        }
                    },
                    log: function (msg)
                    {
                        try
                        {
                            console.log(msg);
                        }
                        catch (err)
                        {
                        }
                    },
                    doubleCheck: function ()
                    {
                        window._EPADashboard_.checkInterval = setInterval(function ()
                        {
                            window._EPADashboard_.checkCount++;
                            if (window._EPADashboard_.checkCount >= 5 || window._EPADashboard_.initStarted)
                            {
                                clearInterval(window._EPADashboard_.checkInterval);
                            }
                            else
                            {
                                window._EPADashboard_.apiInit();
                                window._EPADashboard_.log('YT API init check');
                            }

                        }, 1000);
                    },
                    selectText: function (ele)
                    {
                        if (document.selection)
                        {
                            var range = document.body.createTextRange();
                            range.moveToElementText(ele);
                            range.select();
                        }
                        else if (window.getSelection)
                        {
                            var selection = window.getSelection();
                            var range = document.createRange();
                            range.selectNode(ele);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    },
                    lb: typeof (window.lity) !== 'undefined' ? window.lity() : function ()
                    {
                    },
                    fixDims: function (lity_event, lity_instance)
                    {
                        var $ifm = $(lity_event.target).find('iframe');
                        if (($ifm.height() === 0 || $ifm.width() === 0) && !$ifm.parent().parent().hasClass('lity-content'))
                        {
                            var fwvwrap = document.createElement('div');
                            fwvwrap.className = 'fluid-width-video-wrapper';

                            $ifm.unwrap();
                            $ifm.wrap(fwvwrap).parent('.fluid-width-video-wrapper').attr('style', 'padding-top: 56.25% !important;');
                            $ifm.width('100%');
                            $ifm.height('100%');
                        }
                    },
                    setVidSrc: function ($iframe, vidSrc)
                    {
                        $iframe.attr('src', vidSrc);
                        $iframe.get(0).epytsetupdone = false;
                        window._EPADashboard_.setupevents($iframe.attr('id'));
                    },
                    loadYTAPI: function ()
                    {
                        if (typeof window.YT === 'undefined')
                        {
                            if (window._EPYT_.ytapi_load !== 'never' && (window._EPYT_.ytapi_load === 'always' || $('iframe[src*="youtube.com/embed/"]').length))
                            {
                                var iapi = document.createElement('script');
                                iapi.src = "https://www.youtube.com/iframe_api";
                                iapi.type = "text/javascript";
                                document.getElementsByTagName('head')[0].appendChild(iapi);
                            }
                        }
                        else if (window.YT.loaded)
                        {
                            if (window._EPYT_.pageLoaded)
                            {
                                window._EPADashboard_.apiInit();
                                window._EPADashboard_.log('YT API available');
                            }
                            else
                            {
                                $(window).on('load._EPYT_', function ()
                                {
                                    window._EPADashboard_.apiInit();
                                    window._EPADashboard_.log('YT API available 2');
                                });
                            }
                        }
                    },
                    pageReady: function ()
                    {
                        $('.epyt-gallery').each(function ()
                        {
                            var $container = $(this);
                            if (!$container.data('epytevents') || !$('body').hasClass('block-editor-page'))
                            {
                                $container.data('epytevents', '1');
                                var $iframe = $(this).find('iframe, div.__youtube_prefs_gdpr__').first();
                                var contentlbid = 'content' + $iframe.attr('id');
                                $container.find('.lity-hide').attr('id', contentlbid);
                                var initSrc = $iframe.attr('src');
                                if (!initSrc)
                                {
                                    initSrc = $iframe.data('ep-src');
                                }
                                var firstId = $(this).find('.epyt-gallery-list .epyt-gallery-thumb').first().data('videoid');
                                if (typeof (initSrc) !== 'undefined')
                                {
                                    initSrc = initSrc.replace(firstId, 'GALLERYVIDEOID');
                                    $iframe.data('ep-gallerysrc', initSrc);
                                }
                                else if ($iframe.hasClass('__youtube_prefs_gdpr__'))
                                {
                                    $iframe.data('ep-gallerysrc', '');
                                }

                                var $listgallery = $container.find('.epyt-gallery-list');
                                var pagenumsalign = function ()
                                {
                                    try
                                    {
                                        if ($listgallery.hasClass('epyt-gallery-style-carousel'))
                                        {
                                            var thumbheight = $($listgallery.find('.epyt-gallery-thumb').get(0)).height();
                                            var topval = thumbheight / 2;
                                            var $pagenums = $listgallery.find('.epyt-pagination:first-child .epyt-pagenumbers');
                                            $pagenums.css('top', (topval + 15) + "px");
                                        }
                                    }
                                    catch (e)
                                    {
                                    }
                                };
                                setTimeout(function ()
                                {
                                    pagenumsalign();
                                }, 300);
                                $(window).resize(pagenumsalign);


                                $container.on('click', '.epyt-gallery-list .epyt-gallery-thumb', function ()
                                {
                                    $container.find('.epyt-gallery-list .epyt-gallery-thumb').removeClass('epyt-current-video');
                                    $(this).addClass('epyt-current-video');
                                    var vid = $(this).data('videoid');
                                    $container.data('currvid', vid);
                                    var vidSrc = $iframe.data('ep-gallerysrc').replace('GALLERYVIDEOID', vid);

                                    var thumbplay = $container.find('.epyt-pagebutton').first().data('thumbplay');
                                    if (thumbplay !== '0' && thumbplay !== 0)
                                    {
                                        if (vidSrc.indexOf('autoplay') > 0)
                                        {
                                            vidSrc = vidSrc.replace('autoplay=0', 'autoplay=1');
                                        }
                                        else
                                        {
                                            vidSrc += '&autoplay=1';
                                        }

                                        $iframe.addClass('epyt-thumbplay');
                                    }


                                    if ($container.hasClass('epyt-lb'))
                                    {
                                        window._EPADashboard_.lb('#' + contentlbid);

                                        vidSrc = vidSrc.replace('autoplay=1', 'autoplay=0');

                                        if ($iframe.is('[data-ep-src]'))
                                        {
                                            $iframe.data('ep-src', vidSrc);
                                            $iframe.attr('data-ep-src', vidSrc);

                                        }
                                        else
                                        {
                                            window._EPADashboard_.setVidSrc($iframe, vidSrc);
                                        }

                                        $('.lity-close').focus();

                                    }
                                    else
                                    {
                                        if ($container.find('.epyt-gallery-style-carousel').length === 0)
                                        {
                                            // https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
                                            var bodyScrollTop = Math.max($('body').scrollTop(), $('html').scrollTop());
                                            var scrollNext = $iframe.offset().top - parseInt(_EPYT_.gallery_scrolloffset);
                                            if (bodyScrollTop > scrollNext)
                                            {
                                                $('html, body').animate({
                                                    scrollTop: scrollNext
                                                }, 500, function ()
                                                {
                                                    window._EPADashboard_.setVidSrc($iframe, vidSrc);
                                                });
                                            }
                                            else
                                            {
                                                window._EPADashboard_.setVidSrc($iframe, vidSrc);
                                            }
                                        }
                                        else
                                        {
                                            window._EPADashboard_.setVidSrc($iframe, vidSrc);
                                        }
                                    }

                                }).on('keydown', '.epyt-gallery-list .epyt-gallery-thumb, .epyt-pagebutton', function (e)
                                {
                                    var code = e.which;
                                    if ((code === 13) || (code === 32))
                                    {
                                        e.preventDefault();
                                        $(this).click();

                                    }
                                });

                                $container.on('mouseenter', '.epyt-gallery-list .epyt-gallery-thumb', function ()
                                {
                                    $(this).addClass('hover');
                                    if ($listgallery.hasClass('epyt-gallery-style-carousel') && $container.find('.epyt-pagebutton').first().data('showtitle') == 1)
                                    {
                                        $container.find('.epyt-pagenumbers').addClass('hide');
                                        var ttl = $(this).find('.epyt-gallery-notitle span').text();
                                        $container.find('.epyt-gallery-rowtitle').text(ttl).addClass('hover');
                                    }
                                });

                                $container.on('mouseleave', '.epyt-gallery-list .epyt-gallery-thumb', function ()
                                {
                                    $(this).removeClass('hover');
                                    if ($listgallery.hasClass('epyt-gallery-style-carousel') && $container.find('.epyt-pagebutton').first().data('showtitle') == 1)
                                    {
                                        $container.find('.epyt-gallery-rowtitle').text('').removeClass('hover');
                                        if ($container.find('.epyt-pagebutton[data-pagetoken!=""]').length > 0)
                                        {
                                            $container.find('.epyt-pagenumbers').removeClass('hide');
                                        }
                                    }
                                });

                                $container.on('click', '.epyt-pagebutton', function ()
                                {
                                    var pageData = {
                                        action: 'my_embedplus_gallery_page',
                                        security: _EPYT_.security,
                                        options: {
                                            playlistId: $(this).data('playlistid'),
                                            pageToken: $(this).data('pagetoken'),
                                            pageSize: $(this).data('pagesize'),
                                            columns: $(this).data('epcolumns'),
                                            showTitle: $(this).data('showtitle'),
                                            showPaging: $(this).data('showpaging'),
                                            autonext: $(this).data('autonext'),
                                            hidethumbimg: $(this).data('hidethumbimg'),
                                            style: $(this).data('style'),
                                            thumbcrop: $(this).data('thumbcrop'),
                                            thumbplay: $(this).data('thumbplay')
                                        }
                                    };
                                    if ($(this).data('showdsc'))
                                    {
                                        pageData.options.showDsc = $(this).data('showdsc');
                                    }

                                    var forward = $(this).hasClass('epyt-next');
                                    var currpage = parseInt($container.data('currpage') + "");
                                    currpage += forward ? 1 : -1;
                                    $container.data('currpage', currpage);
                                    $container.find('.epyt-gallery-list').addClass('epyt-loading');

                                    $.post(_EPYT_.ajaxurl, pageData, function (response)
                                    {
                                        $container.find('.epyt-gallery-list').html(response);
                                        $container.find('.epyt-current').each(function ()
                                        {
                                            $(this).text($container.data('currpage'));
                                        });
                                        $container.find('.epyt-gallery-thumb[data-videoid="' + $container.data('currvid') + '"]').addClass('epyt-current-video');

                                        if ($container.find('.epyt-pagebutton').first().data('autonext') == '1')
                                        {
                                            $container.find('.epyt-gallery-thumb').first().click();
                                        }

                                    })
                                            .fail(function ()
                                            {
                                                alert('Sorry, there was an error loading the next page.');
                                            })
                                            .always(function ()
                                            {
                                                $container.find('.epyt-gallery-list').removeClass('epyt-loading');
                                                pagenumsalign();

                                                if ($container.find('.epyt-gallery-style-carousel').length === 0 && $container.find('.epyt-pagebutton').first().data('autonext') != '1')
                                                {
                                                    // https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
                                                    var bodyScrollTop = Math.max($('body').scrollTop(), $('html').scrollTop());
                                                    var scrollNext = $container.find('.epyt-gallery-list').offset().top - parseInt(_EPYT_.gallery_scrolloffset);
                                                    if (bodyScrollTop > scrollNext)
                                                    {
                                                        $('html, body').animate({
                                                            scrollTop: scrollNext
                                                        }, 500);
                                                    }
                                                }
                                            });

                                });
                            }
                        });

                        $('button.__youtube_prefs_gdpr__').on('click', function (e)
                        {
                            e.preventDefault();
                            if ($.cookie)
                            {
                                $.cookie("ytprefs_gdpr_consent", '1', {expires: 30, path: '/'});
                                window.top.location.reload();
                            }
                        });

                    }
                };
    }

    window.onYouTubeIframeAPIReady = typeof window.onYouTubeIframeAPIReady !== 'undefined' ? window.onYouTubeIframeAPIReady : function ()
    {
        if (window._EPYT_.pageLoaded)
        {
            window._EPADashboard_.apiInit();
            window._EPADashboard_.log('YT API ready');
        }
        else
        {
            $(window).on('load._EPYT_', function ()
            {
                window._EPADashboard_.apiInit();
                window._EPADashboard_.log('YT API ready 2');
            });
        }
    };

    window._EPADashboard_.loadYTAPI();

    if (window._EPYT_.pageLoaded)
    {
        window._EPADashboard_.doubleCheck();
    }
    else
    {
        $(window).on('load._EPYT_', function ()
        {
            window._EPADashboard_.doubleCheck();
        });
    }

    $(document).ready(function ()
    {
        $(document).on('lity:ready', function (event, instance)
        {
            try
            {
                window._EPADashboard_.fixDims(event, instance);
            }
            catch (err)
            {
            }
        });

        window._EPADashboard_.pageReady();

        window._EPADashboard_.loadYTAPI();

        if (window._EPYT_.ajax_compat)
        {
            $(window).on('load._EPYT_', function ()
            {
                $(document).ajaxSuccess(function (e, xhr, settings)
                {
                    if (xhr && xhr.responseText && xhr.responseText.indexOf('<iframe ') !== -1)
                    {
                        window._EPADashboard_.loadYTAPI();
                        window._EPADashboard_.apiInit();
                        window._EPADashboard_.log('YT API AJAX');
                        window._EPADashboard_.pageReady();
                    }
                });
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////
        $(window).on('load._EPYT_', function ()
        {
            $('script[type="text/javascript/ytdefer"]').each(function ()
            {
                $(this).clone().attr('type', '').insertAfter(this);
            });
        });

    });
})(window, jQuery);
