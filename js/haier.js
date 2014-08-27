// CRM sdk
TBSCrmTool.init('d1ed0f07ce2ee7328d6fb650868a6320', function () {
    $('#share-to-weibo').css('visibility', 'visible');
    TBSCrmTool.initShareBtn('sina', 'share-to-weibo', "世界杯1/4决赛即将开始，#小雯支招看球菜#就要上菜啦！我们的话题正在火热讨论中，赶紧注册会员吧，点击 http://t.cn/Rv8TTG1，参与接下来的活动，更有海尔厨电全场大礼等你拿！！一场与世界杯的狂欢，一起high吧！", function () {
        alert("亲，活动已经分享到你的微博了喔！快到你的微博看看吧！");
    });
});

$(function () {
    // scroller
    $('a').smoothScroll();

    var updateFuckingStyle = function () {
        $(".center-image").css('left', $("#part-2").width() / 2 - 132);

        if ($(document).width() >= 1280) {
            $("#nav").show();
        } else {
            $("#nav").hide();
        }
    };
    updateFuckingStyle();
    $(window).resize(function () {
        updateFuckingStyle();
    });

    $("#slide-show").owlCarousel({
        singleItem: true,
        autoPlay: 3000
    });


    var cp=$("#slide-show2");
    cp.owlCarousel({
         singleItem: true,
         autoPlay: false,
         navigation:true,
        navigationText: ["",""]
     });

     // "<i class="icon-chevron-left icon-white"></i>",
        // "<i class="icon-chevron-right icon-white"></i>"
        // $(".next").click(function(){
        //     cp.trigger('cp.next');
        // })
        // $(".prev").click(function(){
        //     cp.trigger('cp.prev');
        // })


    $(".fancybox").fancybox();


    // modal
    $('#hdsm').click(function () {
        $('#modal-hdsm, .overlay').show();
    });

    $('#denglu').click(function () {
        if ($.cookie('user')) {
            alert('亲！你已经登入了喔！');
        } else {
            $('#modal-login, .overlay').show();
        }
    });

    $('#zhuce').click(function () {
        $('#modal-zhuce, .overlay').show();
    });

    $('#sccp').click(function () {
        $('#modal-sccp, .overlay').show();
    });

    $(".modal-close").click(function () {
        $('.modal, .overlay').hide();
    });

    var generateCommentHTML = function (user, comment) {
        return '<tr><td><strong>' + user + ' : </strong> <small>' + comment + '</small><td></tr>'
    };

    // loading comment list
    $.ajax({
        type: "get",
        url: "http://haier-test.tbs-info.com/messages",
        success: function (data) {
            $.each(data, function (index, value) {
                var slice = value.message.split(':', 2);
                var user = slice[0];
                var comment = slice[1];

                console.log(user);
                console.log(comment);

                $("#comment-list").append(generateCommentHTML(user, comment));
            });
        },
        dataType: "json",
        crossDomain: true
    });

    // submit comment
    $("#submit-comment").click(function () {
        var user = $.cookie('user');
        if (user) {
            var comment = $("#comment-input").val();
            if (comment.length == 0) {
                alert('亲！你没有填资料喔！');
            } else {
                $.ajax({
                    type: "post",
                    url: "http://haier-test.tbs-info.com/messages",
                    data: {
                        message: user + ' : ' + comment
                    },
                    success: function (data) {
                        console.log(data);
                        $("#comment-list tr:last").remove();

                        $("#comment-list").prepend(generateCommentHTML(user, comment));
                    },
                    dataType: "json",
                    crossDomain: true
                });
            }
        } else {
            alert('亲，请你花1分钟注册登录就可以留言了哦。');
        }
    });

    // zhuce
    $("#btn-zhuce").click(function () {
        var email = $('#zhce-email').val();
        var password = $('#zhce-password').val();
        var userName = $('#zhce-username').val();

        if (email.length == 0 || password.length == 0) {
            alert('亲！资料不能空白喔！');
            return;
        }

        if (!validateEmail(email)) {
            alert('亲！邮箱不要乱填喔！');
            return;
        }

        if (password.length < 6) {
            alert('亲！密码不能少于六位喔！');
            return;
        }

        if (userName.length == 0) {
            alert('亲！要填名字喔！');
            return;
        }

        TBSCrmTool.addConsumer(
                {
                    email: email,
                    password: password,
                    name: userName
                }, function (data) {
                    $.cookie('user', data.name);
                    $('#denglu').hide();
                    $('#logout').show();

                    alert("注册成功，可以留言拉！");
                    $('.modal, .overlay').hide();
                }, function () {

                }
        )
    });

    // login
    $("#btn-login").click(function () {
        var email = $('#login-email').val();
        var password = $('#login-password').val();

        if (email.length == 0 || password.length == 0) {
            alert('亲！资料不能空白喔！');
            return;
        }

        if (!validateEmail(email)) {
            alert('亲！邮箱不要乱填喔！');
            return;
        }

        TBSCrmTool.getConsumer(
                {
                    email: email,
                    password: password
                }, function (data) {
                    console.log(data);

                    $('#denglu').hide();
                    $('#logout').show();
                    $.cookie('user', data.name);

                    alert("登入成功，可以留言拉！");

                    $('.modal, .overlay').hide();
                }, function () {
                    alert("登入失败");
                }
        )
    });

    // logout
    $('#logout').click(function () {
        $.removeCookie('user');
        $('#logout').hide();
        $('#denglu').show();

        alert('退出成功！');
    });

    // check login
    if ($.cookie('user')) {
        $('#denglu').hide();
        $('#logout').show();
    }
});

// helper
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}