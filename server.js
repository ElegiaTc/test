const login = document.getElementsByTagName('button')[0];
const btn1 = document.getElementsByTagName('button')[1];
const logout = document.getElementById('logout');
const btn2 = document.getElementsByClassName('top-idea')[0].getElementsByTagName('div')[0];

const tips = document.getElementsByClassName('tips')[0];
const loginPage = document.getElementsByClassName('login')[0];
const mainPage = document.getElementsByClassName('main-page')[0];
const myMessage = document.getElementsByClassName('my-message')[0];
const personalCenter = document.getElementsByClassName('personal-center')[0];
const articleShow = document.querySelector('.article-show');
const bottomTab = document.getElementsByClassName('bottom-tab')[0];
const avatar = document.getElementsByClassName('avatar')[0];
const avatar1 = document.querySelector('.head');
const upload = document.getElementById('uploadImage');
const images = document.querySelector('#image');
const navButton = document.getElementById('nav-name').querySelectorAll('li');
const pageChange = document.querySelector('.m-hiddenbox');
const otherPage = document.querySelector('.other-page');

var userId = null;
var receiverId = null;
var othersId = null;

let receiverAvatar = null;
var myAvatarSrc = null;

var backControl = 0;
var otherControl = 0;
var sendControl = 0;

let columnOne = 0;       //高度计数器
let columnTwo = 0;
let column1 = 0;
let column2 = 0;

let mycolumnOne = 0;       //高度计数器
let mycolumnTwo = 0;
let mycolumn1 = 0;
let mycolumn2 = 0;
//获取当前滚动条位置
var nowScrollTop = 0;
function getScrollTop() {
    let scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}
// window.onscroll = function () {
//     nowScrollTop = document.documentElement.scrollTop;
// }
let socket = io.connect("ws://175.178.193.182:8080/chat");
console.log(socket);

socket.on("connect", () => {
    console.log(socket.connected);
})
console.log(socket);

function ajax(options) {
    // 存储默认值的对象
    var defaults = {
        type: 'get',
        url: '',
        data: {},
        success: function () { },
        error: function () { }
    }

    // options对象覆盖defaults对象中的属性
    Object.assign(defaults, options);

    // 创建ajax对象
    var xhr = new XMLHttpRequest();
    // 拼接请求参数的变量
    var params = '';
    // 循环用户传递进来的对象格式参数
    for (var attr in defaults.data) {
        // 将对象参数转化为字符串格式
        params += attr + '=' + defaults.data[attr] + '&';
    }
    // 将参数最后的&去掉
    params = params.substr(0, params.length - 1);
    // console.log(params);
    // 判断请求方式
    if (defaults.type == 'get') {
        defaults.url = defaults.url + '?' + params;
    }

    // 配置ajax对象
    xhr.open(defaults.type, defaults.url);

    // 发送请求
    if (defaults.type == 'post') {

        // 如果类型为json,向服务器端传递json数据格式的参数
        xhr.send(JSON.stringify(defaults.data));

    } else {
        xhr.send();
    }

    // 监听xhr对象下面的onload事件
    // xhr对象接收完响应数据后触发
    xhr.onload = function () {
        // 获取响应头中的数据
        var contentType = xhr.getResponseHeader('Content-Type');
        // 服务器返回的数据
        var responseText = xhr.responseText;
        if (contentType.includes('application/json')) {
            // 将json字符串转换为json对象
            responseText = JSON.parse(responseText);
        }

        // http状态码为200
        if (xhr.status === 200) {
            // 请求成功，调用成功的函数
            defaults.success(responseText, xhr);
        } else {
            // 请求失败，调用失败的函数
            defaults.error(responseText, xhr);
        }
    }
}

const myName = document.getElementById('my-name');
const myFollowers = document.getElementById('my-followers');
const myfans = document.getElementById('my-fans');
const myLikestars = document.getElementById('my-likestars');
//获取个人信息
function getMessage() {
    var objects = {
        url: 'http://175.178.193.182:8080/user/fullInfo',
        data: {
            userId: userId
        },
        success: function (data, xhr) {
            console.log('这里是success函数');
            let user = data.user;
            myName.innerHTML = user.nickname;
            myAvatarSrc = user.avatar;
            avatar.style.backgroundImage = 'url(' + user.avatar + ')';
            avatar1.style.backgroundImage = 'url(' + user.avatar + ')';
            const myAvatar = articleShow.querySelector('.myavatar').querySelector('img');
            myAvatar.src = user.avatar;
            myFollowers.innerHTML = user.follows.length;
            myfans.innerHTML = user.fans.length;
            myLikestars.innerHTML = user.likedArticles.length + user.staredArticles.length;
        },
        // 请求失败后的函数
        error: function (data, xhr) {
            console.log('这里是error函数' + data);
            console.log(xhr);
        }
    }
    ajax(objects);
}

//获取详细信息
function getDetail() {
    var objects = {
        url: 'http://175.178.193.182:8080/user/baseInfo',
        data: {
            userId: userId
        },
        success: function (data, xhr) {
            console.log(data);
            document.getElementById('my-editname').innerHTML = data.user.nickname;
            document.getElementById('my-sex').innerHTML = data.user.gender;
            document.getElementById('my-birthday').innerHTML = data.user.birthday;
            document.getElementById('my-region').innerHTML = data.user.area;
            document.getElementById('my-intro').innerHTML = data.user.description;
            backgroundPicture.src = data.user.backGroundPicture;
        },
        // 请求失败后的函数
        error: function (data, xhr) {
            console.log('这里是error函数' + data);
            console.log(xhr);
        }
    }
    ajax(objects);
}

//他人主页加载
const clickFollowOther = document.querySelector('.click-follow');
const clickToMessage = document.querySelector('.to-message');
function getOtherMessage(otherId) {
    othersId = otherId;
    const otherAvatar = document.getElementById('other-avatar');
    const otherName = document.getElementById('other-name');
    const oFollowers = document.getElementById('o-followers');
    const oFans = document.getElementById('o-fans');
    const oLikestars = document.getElementById('o-likestars');
    var objects = {
        url: 'http://175.178.193.182:8080/user/fullInfo',
        data: {
            userId: otherId
        },
        success: function (data, xhr) {
            console.log('这里是success函数');
            const user = data.user;
            otherAvatar.src = user.avatar;
            otherName.innerHTML = user.nickname;
            oFollowers.innerHTML = user.follows.length;
            oFans.innerHTML = user.fans.length;
            oLikestars.innerHTML = user.likedArticles.length + user.staredArticles.length;
            if (user.fans.indexOf(userId) != -1) {

                clickFollowOther.style.display = 'none';
                clickToMessage.style = '';
            } else {
                clickFollowOther.style = 'block';
                clickToMessage.style.display = 'none';
            }
        },
        // 请求失败后的函数
        error: function (data, xhr) {
            console.log('这里是error函数' + data);
            console.log(xhr);
        }
    }
    ajax(objects);
}
//他人主页关注他人
clickFollowOther.onclick = function () {
    axios.post('http://175.178.193.182:8080/user/follow', {
        userId: userId,
        followerId: othersId
    })
        .then(function (response) {
            console.log(response);
            clickFollowOther.style.display = 'none';
            clickToMessage.style = '';
        })
        .catch(function (error) {
            console.log(error);
        });
}

//通过他人主页发私信
clickToMessage.onclick = function () {
    axios.get('http://175.178.193.182:8080/user/fullInfo?userId=' + othersId)
        .then(function (response) {
            console.log(response);
            if (response.data.user.follows.indexOf(userId) != -1) {
                console.log(1);
                receiverId = othersId;
                sendControl = 2;
                otherPage.style.display = 'none';
                chatWindow.style.display = 'block';
                const chatName = document.getElementById('chat-name');
                let receiverAvatar = null;
                axios.get('http://175.178.193.182:8080/user/fullInfo?userId=' + receiverId)
                    .then(function (response) {
                        console.log(response);
                        chatName.innerHTML = response.data.user.nickname;
                        receiverAvatar = response.data.user.avatar;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

                axios.get('http://175.178.193.182:8080/chat/getRecord?userId=' + userId + '&receiverId=' + receiverId + '&page=1')
                    .then(function (response) {
                        console.log(response);
                        // if (response.data.newRecord.length == 0) {
                        //     return;
                        // }
                        const record = response.data.newRecord;
                        counter = record.length;
                        if (counter != 0) {
                            const chatPage = document.querySelector('.chat-page');
                            const chatBox = document.createElement('div');
                            chatBox.className = 'chat-box';
                            if (chatPage.children[0]) {
                                chatPage.insertBefore(chatBox, chatPage.children[0]);
                            } else {
                                chatPage.appendChild(chatBox);
                            }
                            for (let i = 0; i < record.length; i++) {
                                const part = document.createElement('div');

                                chatBox.appendChild(part);
                                const chatAvatar = document.createElement('div');
                                chatAvatar.className = 'chat-avatar';
                                const chatRecord = document.createElement('div');
                                chatRecord.className = 'chat-record';
                                part.appendChild(chatAvatar);
                                part.appendChild(chatRecord);
                                const img = document.createElement('img');
                                chatAvatar.appendChild(img);
                                chatRecord.innerHTML = record[i].message;
                                if (record[i].userId == userId) {
                                    part.className = 'my-part';
                                    img.src = myAvatarSrc;
                                } else {
                                    part.className = 'your-part';
                                    img.src = receiverAvatar;
                                }
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                clickTipSend.style = '';
                setTimeout(() => {
                    clickTipSend.style.display = 'none';
                }, 1000);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

//添加首页盒子
function addBox(container) {
    let item = document.createElement('div');
    item.className = 'm-items';
    container.appendChild(item);
    let img1 = document.createElement('img');
    img1.className = 'picture';
    item.appendChild(img1);
    let h3 = document.createElement('h3');
    item.appendChild(h3);
    let avatar = document.createElement('div');
    avatar.className = 'avatar';
    item.appendChild(avatar);
    let img2 = document.createElement('img');
    img2.className = 'avatar1';
    avatar.appendChild(img2);
    let span1 = document.createElement('span');
    let span2 = document.createElement('span');
    let span3 = document.createElement('span');
    avatar.appendChild(span1);
    let good = document.createElement('div');
    good.className = 'good';
    avatar.appendChild(good);
    good.appendChild(span2);
    good.appendChild(span3);
}

//图片加载
function imgLoad(img, callback) {
    var timer = setInterval(function () {
        if (img.complete) {
            callback();
            clearInterval(timer);
        }
    }, 1)
}

//文章详情页加载
const likeNum = document.getElementById('like-num');
const starNum = document.getElementById('star-num');
const reviewNum = document.getElementById('review-num');
const changePicture = document.getElementById('change-picture');
function loadArticleShow(articleId) {
    const authorAvatar = document.getElementById('author-avatar');
    const authorName = document.getElementById('author-name');
    const title = articleShow.querySelector('.title');
    const content = articleShow.querySelector('.content');
    const postDate = articleShow.querySelector('.dates');
    const reviews = articleShow.querySelector('#reviews');
    var objects = {
        url: 'http://175.178.193.182:8080/article/byId',
        data: {
            articleId: articleId
        },
        success: function (data, xhr) {
            console.log(data);
            const message = data.article;
            nowAuthorId = message.authorId;
            console.log(message);

            const pictureContainer = document.querySelector('.picture-container');
            for (let i = 0; i <= message.images.length - 1; i++) {
                const pItems = document.createElement('div');
                pItems.className = 'p-items';
                pictureContainer.appendChild(pItems);
                const img = document.createElement('img');
                pItems.appendChild(img);
                img.src = message.images[i];
                const li = document.createElement('li');
                li.setAttribute('data-index', i);
                changePicture.appendChild(li);
            }
            changePicture.children[0].className = 'focus-picture';
            title.innerHTML = message.title;
            content.innerHTML = message.content;
            postDate.innerHTML = message.postDate.substring(5, 10);
            reviews.innerHTML = message.reviews;
            reviewNum.innerHTML = message.reviews;
            likeNum.innerHTML = message.likes;
            starNum.innerHTML = message.stars;

            const likeIcon = document.getElementById('like-icon');
            const starIcon = document.getElementById('star-icon');
            if (message.likerList.indexOf(userId) != -1) {
                likeIcon.innerHTML = '&#xe613;';
                likeIcon.style.color = 'red';
            }
            if (message.starerList.indexOf(userId) != -1) {
                starIcon.innerHTML = '&#xe627;';
                starIcon.style.color = 'yellow';
            }
            //添加tag
            const tagsList = articleShow.querySelector('.tags');
            for (let i = 0; i < message.tags.length; i++) {
                let tagItems = document.createElement('div');
                tagItems.className = 'tag-items';
                tagsList.appendChild(tagItems);
                tagItems.innerHTML = '#' + message.tags[i];
            }
            const deAr = document.querySelector('.delate-article');
            if (message.authorId == userId) {
                deAr.style.display = 'block';
            } else {
                deAr.style.display = 'none';
            }
            //获取作者名字头像
            axios.get('http://175.178.193.182:8080/user/fullInfo?userId=' + message.authorId)
                .then(function (response) {

                    console.log(response);
                    const user = response.data.user;
                    authorAvatar.src = user.avatar;
                    authorAvatar.setAttribute('data-authorId', user.userId);
                    authorName.innerText = user.nickname;
                    if (user.fans.indexOf(userId) != -1) {
                        const ifFollow = document.querySelector('.article-show').querySelector('.if-follow');
                        ifFollow.innerHTML = '已关注';
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            //获取评论信息
            axios.get('http://175.178.193.182:8080/review/byArticle?articleId=' + articleId + '&pages=0')
                .then(function (response) {
                    console.log(response);
                    const reviews = response.data.reviews;
                    const container = articleShow.querySelector('.comments-container');
                    for (let i = 0; i < reviews.length; i++) {
                        const cItems = document.createElement('div');
                        cItems.className = 'comments-items';
                        container.appendChild(cItems);

                        const parentRow = document.createElement('div');
                        parentRow.className = 'parent-row';
                        cItems.appendChild(parentRow);
                        const avatar = document.createElement('div');
                        avatar.className = 'avatar';
                        const mainBox = document.createElement('div');
                        mainBox.className = 'main-box';

                        mainBox.setAttribute('data-authorId', reviews[i].authorId);
                        mainBox.setAttribute('data-reviewId', reviews[i].reviewId);

                        const smallBox = document.createElement('div');
                        smallBox.className = 'small-box';

                        const iconFont = document.createElement('i');
                        iconFont.className = 'iconfont';

                        const reviewLike = document.createElement('div');
                        reviewLike.className = 'review-like';

                        parentRow.appendChild(avatar);
                        parentRow.appendChild(mainBox);
                        parentRow.appendChild(smallBox);
                        smallBox.appendChild(iconFont);
                        smallBox.appendChild(reviewLike);


                        const img1 = document.createElement('img');  //一级评论头像
                        avatar.appendChild(img1);
                        const reviewName = document.createElement('div');
                        reviewName.className = 'name';
                        const reviewContact = document.createElement('div');
                        reviewContact.className = 'review-contact';
                        const reviewDate = document.createElement('div');
                        reviewDate.className = 'review-date';
                        mainBox.appendChild(reviewName);
                        mainBox.appendChild(reviewContact);
                        mainBox.appendChild(reviewDate);

                        if (reviews[i].authorId == userId) {
                            const delateReview = document.createElement('div');
                            delateReview.className = 'delate-review';
                            mainBox.appendChild(delateReview);
                            delateReview.innerHTML = '删除';
                            delateReview.setAttribute('data-reviewid', reviews[i].reviewId);
                            delateReview.addEventListener('click', (e) => {
                                e.stopPropagation();
                                console.log(parseInt(e.target.getAttribute('data-reviewId')));
                                axios.post('http://175.178.193.182:8080/review/delete', {
                                    reviewId: e.target.getAttribute('data-reviewId')
                                })
                                    .then(function (response) {
                                        console.log(response);
                                        e.target.parentNode.parentNode.parentNode.remove();
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            })
                        }

                        reviewContact.innerHTML = reviews[i].content;
                        reviewDate.innerHTML = reviews[i].postDate.substring(5, 10);
                        reviewLike.innerHTML = reviews[i].likerList.length;
                        if (reviews[i].likerList.indexOf(userId) != -1) {
                            iconFont.innerHTML = '&#xe613;';
                            iconFont.style.color = 'red';
                        } else {
                            iconFont.innerHTML = '&#xe614;';
                        }
                        // reviewLike.setAttribute('data-reviewId', reviews[i].reviewId);
                        smallBox.setAttribute('data-reviewId', reviews[i].reviewId);
                        //个人评论头像加载

                        axios.get('http://175.178.193.182:8080/user/baseInfo?userId=' + reviews[i].authorId)
                            .then(function (response) {

                                console.log(response);
                                const user = response.data.user;
                                img1.src = user.avatar;
                                img1.setAttribute('data-reviewerid', user.userId);
                                reviewName.innerHTML = user.nickname;
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        //判断是否有二级评论并添加
                        if (reviews[i].reviewList.length > 0) {
                            for (let j = 0; j < reviews[i].reviewList.length; j++) {
                                const sonRow = document.createElement('div');
                                sonRow.className = 'son-row';
                                cItems.appendChild(sonRow);
                                const white = document.createElement('div');
                                white.className = 'white';
                                const mainSonbox = document.createElement('div');
                                mainSonbox.className = 'main-sonbox';

                                const smallBox = document.createElement('div');
                                smallBox.className = 'small-box';

                                const sonIcon = document.createElement('i');
                                sonIcon.className = 'iconfont';

                                const sonLike = document.createElement('div');
                                sonLike.className = 'review-like';
                                sonRow.appendChild(white);
                                sonRow.appendChild(mainSonbox);
                                sonRow.appendChild(smallBox);
                                smallBox.appendChild(sonIcon);
                                smallBox.appendChild(sonLike);
                                const sonAvatar = document.createElement('div');
                                sonAvatar.className = 'son-avatar';
                                const img2 = document.createElement('img');
                                mainSonbox.appendChild(sonAvatar);
                                sonAvatar.appendChild(img2);
                                const sonBox = document.createElement('div');
                                sonBox.className = 'son-box';
                                mainSonbox.appendChild(sonBox);
                                const sonName = document.createElement('div');
                                const sonContact = document.createElement('div');
                                sonName.className = 'son-name';
                                sonContact.className = 'son-contact';
                                sonBox.appendChild(sonName);
                                sonBox.appendChild(sonContact);
                                const spanDate = reviews[i].reviewList[j].postDate.substring(5, 10);

                                if (reviews[i].reviewList[j].authorId == userId) {
                                    const delateReview = document.createElement('div');
                                    delateReview.className = 'delate-review';
                                    sonBox.appendChild(delateReview);
                                    delateReview.innerHTML = '删除';
                                    delateReview.setAttribute('data-reviewid', reviews[i].reviewList[j].reviewId);
                                    delateReview.addEventListener('click', (e) => {
                                        e.stopPropagation();
                                        console.log(parseInt(e.target.getAttribute('data-reviewId')));
                                        axios.post('http://175.178.193.182:8080/review/delete', {
                                            reviewId: e.target.getAttribute('data-reviewId')
                                        })
                                            .then(function (response) {
                                                console.log(response);
                                                e.target.parentNode.parentNode.parentNode.remove();
                                            })
                                            .catch(function (error) {
                                                console.log(error);
                                            });
                                    })
                                }

                                sonContact.innerHTML = reviews[i].reviewList[j].content + ' <span>' + spanDate + '</span>';
                                sonLike.innerHTML = reviews[i].reviewList[j].likerList.length;
                                if (reviews[i].reviewList[j].likerList.indexOf(userId) != -1) {
                                    sonIcon.innerHTML = '&#xe613;';
                                    sonIcon.style.color = 'red';
                                } else {
                                    sonIcon.innerHTML = '&#xe614;';
                                }
                                // sonLike.setAttribute('data-reviewId', reviews[i].reviewList[j].reviewId);
                                smallBox.setAttribute('data-reviewId', reviews[i].reviewList[j].reviewId);
                                axios.get('http://175.178.193.182:8080/user/baseInfo?userId=' + reviews[i].reviewList[j].authorId)
                                    .then(function (response) {

                                        console.log(response);

                                        img2.src = response.data.user.avatar;
                                        img2.setAttribute('data-reviewerid', response.data.user.userId);
                                        sonName.innerHTML = response.data.user.nickname;
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            }
                        }

                    }
                    replyTo();
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        // 请求失败后的函数
        error: function (data, xhr) {
            console.log('这里是error函数' + data);
            console.log(xhr);
        }
    }
    ajax(objects);
}

changePicture.addEventListener('click', (e) => {
    if (e.target.tagName == 'LI') {
        for (let i = 0; i < changePicture.children.length; i++) {
            changePicture.children[i].className = '';

        }
        e.target.className = 'focus-picture';
        const pnum = e.target.getAttribute('data-index');
        console.log(pnum);
        const pictureContainer = document.querySelector('.picture-container');
        animate3(pictureContainer, -pnum * 100);
    }
})
var nowstep = 0;
function animate3(obj, target, callback) {          //左右滑动
    clearInterval(obj.timer3);
    obj.timer3 = setInterval(function () {
        if (target > nowstep) {
            nowstep += 2;
        } else if (target < nowstep) {
            nowstep -= 2;
        } else if (nowstep == target) {
            clearInterval(obj.timer3);
            callback && callback();
        }
        obj.style.transform = 'translateX(' + nowstep + 'vw)';
    }, 1);
}

//回复评论
var replyUser = 0;
var replyReview = 0;
function replyTo() {
    let comItems = document.querySelectorAll('.main-box');
    for (let i = 0; i < comItems.length; i++) {
        comItems[i].onclick = function () {
            replyUser = this.getAttribute('data-authorId');
            replyReview = this.getAttribute('data-reviewId');
            console.log(replyUser);
            saySomething.focus();

        }
    }
}

//文章评论跳转他人主页 
const commentsContainer = document.querySelector('.comments-container');
commentsContainer.addEventListener('click', (e) => {
    // e.stopPropagation();
    if (e.target && e.target.getAttribute('data-reviewerid')) {

        otherControl = 1;

        console.log(e.target.getAttribute('data-reviewerid'));

        const oid = e.target.getAttribute('data-reviewerid');

        articleShow.style.display = 'none';

        otherPage.style = '';

        getOtherMessage(oid);

        document.documentElement.scrollTop = 0;

        oPage.click();
    }
    //点赞评论
    else if (e.target && e.target.getAttribute('data-reviewid')) {
        console.log(e.target.getAttribute('data-reviewid'));
        const reviewId = e.target.getAttribute('data-reviewid');
        axios.post('http://175.178.193.182:8080/review/like', {
            userId: userId,
            reviewId: reviewId
        })
            .then(function (response) {
                console.log(response);
                if (response.data.status >= 300) {
                    axios.post('http://175.178.193.182:8080/review/unlike', {
                        userId: userId,
                        reviewId: reviewId
                    })
                        .then(function (response) {
                            console.log(response);
                            e.target.children[1].innerHTML = parseInt(e.target.children[1].innerHTML) - 1;
                            e.target.children[0].innerHTML = '&#xe614;';
                            e.target.children[0].style.color = 'black';
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else {
                    e.target.children[1].innerHTML = parseInt(e.target.children[1].innerHTML) + 1;

                    e.target.children[0].innerHTML = '&#xe613;';
                    e.target.children[0].style.color = 'red';
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }
})
//文章中点击作者头像 跳转其主页
const inArticleAuthor = document.getElementById('author-avatar');
inArticleAuthor.onclick = function () {
    otherControl = 1;

    console.log(this.getAttribute('data-authorid'));

    const oid = this.getAttribute('data-authorid');

    articleShow.style.display = 'none';

    otherPage.style = '';

    getOtherMessage(oid);
}

//文章评论准备
const postReview = document.getElementById('post-review');
const saySomething = document.getElementById('say-something');
const showIcons = articleShow.querySelector('.icons');
const sendReview = document.getElementById('send-review');
const showMask = document.querySelector('.show-mask');
postReview.onclick = function () {
    showMask.style = '';
    saySomething.focus();
    console.log(1);
}
showMask.onclick = function () {
    this.style.display = 'none';
    showIcons.style = '';
    saySomething.value = '';
    sendReview.style.display = 'none';
    saySomething.placeholder = '说点什么……';
    replyUser = 0;
    replyReview = 0;
}
saySomething.onfocus = function () {
    showMask.style = '';
    if (this.value != '') {
        sendReview.style = '';
    }
    // document.body.addEventListener('touchmove', function (e) {
    //     e.preventDefault();
    // }, { passive: false });
    showIcons.style.display = 'none';
    this.placeholder = '说点什么吧，万一火了呢';
}

// saySomething.onblur = function () {
//     showIcons.style = '';
//     sendReview.style.display = 'none';
//     this.placeholder = '说点什么……';
// }
saySomething.oninput = function () {
    if (this.value != '') {
        sendReview.style = '';
        showIcons.style.display = 'none';
    } else {
        sendReview.style.display = 'none';
        showIcons.style = '';
    }
}

//推荐页加载
function loadRecommend() {

    const xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.open('GET', 'http://175.178.193.182:8080/article/getHomePage');

    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.status);
                console.log(xhr.statusText);
                console.log(xhr.getAllResponseHeaders());
                console.log(xhr.response.pages.推荐);


                const recommend = xhr.response.pages.推荐;

                for (let i = 0; i < recommend.length; i++) {
                    // (function (i) {
                    let count = 0;

                    // console.log(columnOne);
                    if (columnOne > columnTwo) {
                        count = 1;

                    } else {
                        count = 0;
                    }
                    let mcontainer = document.querySelectorAll('.m-column')[count];
                    addBox(mcontainer);
                    let putIn = mcontainer.querySelectorAll('.m-items')[count ? column2 : column1];
                    let putimage = putIn.querySelector('.picture');
                    let puth3 = putIn.querySelector('h3');
                    let putavatar = putIn.querySelector('.avatar1');
                    let putspan = putIn.querySelectorAll('span');
                    putIn.setAttribute('data-articleId', recommend[i].articleId)
                    putimage.src = recommend[i].images[0];
                    puth3.innerHTML = recommend[i].title;
                    putavatar.src = recommend[i].avatar;
                    putspan[0].innerHTML = recommend[i].authorName;
                    putspan[1].className = 'iconfont';
                    if (recommend[i].likerList.indexOf(userId) != -1) {
                        putspan[1].innerHTML = '&#xe613;';
                        putspan[1].style.color = 'red';

                    } else {
                        putspan[1].innerHTML = '&#xe614;';
                    }
                    putspan[2].innerHTML = recommend[i].likes;
                    // console.log(putimage.offsetHeight);

                    // while(!putimage.complete){
                    // delay(1);
                    // }
                    let gaodu = putIn.offsetHeight;
                    // console.log(gaodu);
                    if (count == 0) {
                        columnOne += gaodu;
                        column1++;
                    } else {
                        columnTwo += gaodu;
                        column2++;
                    }
                    console.log(columnOne);
                    console.log(columnTwo);
                    //}(i))
                }
            }
        }
    }
}

//聊天列表加载
const text = document.getElementById('1234');
function loadChatList() {
    axios.get('http://175.178.193.182:8080/chat/getList?userId=' + userId)
        .then(function (response) {
            const chatUser = response.data.chatList;
            const chatList = document.querySelector('.chat-list');
            console.log(response);
            for (let i = 0; i < chatUser.length; i++) {
                const chatItems = document.createElement('div');
                chatItems.className = 'chat-items';
                chatList.appendChild(chatItems);
                chatItems.setAttribute('data-receiverId', chatUser[i].userId)
                const chatAvatar = document.createElement('div');
                const chatBox = document.createElement('div');
                chatAvatar.className = 'chat-avatar';
                chatBox.className = 'chat-box';
                chatItems.appendChild(chatAvatar);
                chatItems.appendChild(chatBox);
                const img = document.createElement('img');
                chatAvatar.appendChild(img);
                const chatName = document.createElement('div');
                const chatIntro = document.createElement('div');
                chatBox.appendChild(chatName);
                chatBox.appendChild(chatIntro);
                img.src = chatUser[i].avatar;
                chatName.innerHTML = chatUser[i].nickname;
                chatIntro.innerHTML = chatUser[i].description;
            }
            loadChat();
        })
        .catch(function (error) {
            console.log(error);
        });

    // axios.post('http://175.178.193.182:8080/chat/send', {
    //     userId: 49,
    //     receiverId: 51,
    //     message: '你好'
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
}
let loginxhr = null;
let loginIsSending = false;
//登录
login.onclick = function () {
    var username = document.getElementsByTagName('input')[0].value;
    var password = document.getElementsByTagName('input')[1].value;
    // var clearall = document.getElementsByTagName('input')[1];
    // let userId = null;
    // console.log(username);

    if (username != '' && password != '') {
        if (loginIsSending) loginxhr.abort();

        loginxhr = new XMLHttpRequest();

        loginIsSending = true;

        loginxhr.responseType = 'json';

        loginxhr.open('POST', 'http://175.178.193.182:8080/login');

        loginxhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        loginxhr.send('username=' + username + '&password=' + password);

        document.getElementsByTagName('input')[1].value = '';

        loginxhr.onreadystatechange = function () {
            if (loginxhr.readyState === 4) {
                loginIsSending = false;
                if (loginxhr.response.status == 200) {
                    userId = loginxhr.response.userId;

                    loginPage.style.display = 'none';
                    bottomTab.style = '';
                    mainPage.style = '';
                    getMessage();
                    getDetail();
                    loadRecommend();
                    loadChatList();

                    // console.log(userId);
                    socket.emit("online", String(userId));
                    socket.on("receive-message", (res) => {
                        console.log(res);
                        if (chatWindow.style.display != 'none' && res.userId == receiverId) {
                            const part = document.createElement('div');
                            const chatPage = document.querySelector('.chat-page');
                            chatPage.appendChild(part);
                            const chatAvatar = document.createElement('div');
                            chatAvatar.className = 'chat-avatar';
                            const chatRecord = document.createElement('div');
                            chatRecord.className = 'chat-record';
                            part.appendChild(chatAvatar);
                            part.appendChild(chatRecord);
                            const img = document.createElement('img');
                            chatAvatar.appendChild(img);
                            chatRecord.innerHTML = res.message;
                            part.className = 'your-part';
                            img.src = receiverAvatar;
                        }
                    })
                    console.log(socket);
                } else {
                    tips.innerHTML = loginxhr.response.msg + '!';
                    window.setTimeout(function () {
                        tips.innerHTML = '';
                    }, 2000);
                }
            }
        }
    } else {
        tips.innerHTML = '请输入账号或密码！';
        window.setTimeout(function () {
            tips.innerHTML = '';
        }, 2000);
    }


}

//文章点击
var nowArticleId = null;
var nowAuthorId = null;
let mainContainer = document.querySelector('#recommend');
let myContainer = document.querySelector('.my-container');
let otherContainer = document.querySelector('.other-container');
let searchContainer = document.getElementById('search-article');
mainContainer.addEventListener('click', (e) => {
    if (e.target && e.target.getAttribute('data-articleid')) {
        const aid = e.target.getAttribute('data-articleid');
        nowScrollTop = getScrollTop();
        console.log(nowScrollTop);
        nowArticleId = aid;
        mainPage.style.display = 'none';
        bottomTab.style.display = 'none';
        articleShow.style.display = 'block';
        document.documentElement.scrollTop = 0;
        backControl = 0;
        console.log(aid);
        loadArticleShow(aid);
    }
})
myContainer.addEventListener('click', (e) => {
    if (e.target && e.target.getAttribute('data-articleid')) {
        const aid = e.target.getAttribute('data-articleid');
        nowScrollTop = getScrollTop();
        console.log(nowScrollTop);
        nowArticleId = aid;
        personalCenter.style.display = 'none';
        bottomTab.style.display = 'none';
        articleShow.style.display = 'block';
        document.documentElement.scrollTop = 0;
        backControl = 4;
        console.log(aid);
        loadArticleShow(aid);
    }
})
otherContainer.addEventListener('click', (e) => {
    if (e.target && e.target.getAttribute('data-articleid')) {
        const aid = e.target.getAttribute('data-articleid');
        nowScrollTop = getScrollTop();
        console.log(nowScrollTop);
        nowArticleId = aid;
        otherPage.style.display = 'none';
        bottomTab.style.display = 'none';
        articleShow.style.display = 'block';
        document.documentElement.scrollTop = 0;
        backControl = 5;
        console.log(aid);
        loadArticleShow(aid);
    }
})
searchContainer.addEventListener('click', (e) => {
    if (e.target && e.target.getAttribute('data-articleid')) {
        const aid = e.target.getAttribute('data-articleid');
        nowScrollTop = getScrollTop();
        console.log(nowScrollTop);
        nowArticleId = aid;
        bigContainer[2].style.display = 'none';
        bottomTab.style.display = 'none';
        mainPage.style.display = 'none';
        articleShow.style.display = 'block';
        document.documentElement.scrollTop = 0;
        backControl = 6;
        console.log(aid);
        loadArticleShow(aid);
    }
})

//文章点赞
const articleLikes = articleShow.querySelector('.likes');
articleLikes.onclick = function () {
    console.log(nowArticleId);
    axios.post('http://175.178.193.182:8080/article/like', {
        userId: userId,
        articleId: nowArticleId
    })
        .then(function (response) {
            console.log(response);
            const likeIcon = document.getElementById('like-icon');
            if (response.data.status >= 300) {
                axios.post('http://175.178.193.182:8080/article/unlike', {
                    userId: userId,
                    articleId: nowArticleId
                })
                    .then(function (response) {
                        console.log(response);
                        likeNum.innerHTML = parseInt(likeNum.innerHTML) - 1;

                        likeIcon.innerHTML = '&#xe614;';
                        likeIcon.style.color = 'black';
                    })
                    .catch(function (error) {
                        console.log(error);

                    });
            } else {
                likeNum.innerHTML = parseInt(likeNum.innerHTML) + 1;
                likeIcon.innerHTML = '&#xeca2;';
                likeIcon.style.color = 'red';
            }
        })
        .catch(function (error) {
            console.log(error);

        });
}

//文章收藏
const articleStars = articleShow.querySelector('.stars');
articleStars.onclick = function () {
    console.log(nowArticleId);
    axios.post('http://175.178.193.182:8080/article/star', {
        userId: userId,
        articleId: nowArticleId
    })
        .then(function (response) {
            console.log(response);
            const starIcon = document.getElementById('star-icon');
            if (response.data.status >= 300) {
                axios.post('http://175.178.193.182:8080/article/unstar', {
                    userId: userId,
                    articleId: nowArticleId
                })
                    .then(function (response) {
                        console.log(response);
                        starNum.innerHTML = parseInt(starNum.innerHTML) - 1;
                        starIcon.innerHTML = '&#xe615;';
                        starIcon.style.color = 'black';
                    })
                    .catch(function (error) {
                        console.log(error);

                    });
            } else {
                starNum.innerHTML = parseInt(starNum.innerHTML) + 1;
                starIcon.innerHTML = '&#xe627;';
                starIcon.style.color = 'yellow';
            }
        })
        .catch(function (error) {
            console.log(error);

        });
}

//文章评论
sendReview.onclick = function () {
    // console.log(saySomething.value);
    console.log(replyReview || null);
    axios.post('http://175.178.193.182:8080/review', {
        replyToUserId: replyUser || nowAuthorId,
        replyToArticleId: nowArticleId,
        parentReviewId: replyReview || null,
        authorId: userId,
        content: saySomething.value
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    saySomething.value = '';
    saySomething.placeholder = '说点什么……';
    this.style.display = 'none';
    showIcons.style = '';
    showMask.style.display = 'none';
    replyUser = 0;
    replyReview = 0;
}

//从文章中关注作者
const ifFollow = document.querySelector('.if-follow');
ifFollow.onclick = function () {
    axios.post('http://175.178.193.182:8080/user/follow', {
        userId: userId,
        followerId: nowAuthorId
    })
        .then(function (response) {
            console.log(response);
            const ifFollow = document.querySelector('.article-show').querySelector('.if-follow');
            if (response.data.status >= 300) {
                axios.post('http://175.178.193.182:8080/user/cancelFollow', {
                    userId: userId,
                    followerId: nowAuthorId
                })
                    .then(function (response) {
                        console.log(response);
                        ifFollow.innerHTML = '未关注';
                    })
                    .catch(function (error) {
                        console.log(error);

                    });
            } else {
                ifFollow.innerHTML = '已关注';
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

//文章删除
const delateArticle = articleShow.querySelector('.delate-article');
delateArticle.onclick = function () {
    console.log('文章删除');
    axios.post('http://175.178.193.182:8080/article/delete', {
        articleId: nowArticleId
    })
        .then(function (response) {
            console.log(response);
            showBack.click();
        })
        .catch(function (error) {
            console.log(error);
        });
}

//推荐页返回
const showBack = document.getElementById('show-back');
showBack.onclick = function () {

    const tagsItems = articleShow.querySelector('.tags').querySelectorAll('.tag-items');
    for (let i = tagsItems.length - 1; i >= 0; i--) {
        tagsItems[i].remove();
    }

    const commentsItems = articleShow.querySelector('.comments-container').querySelectorAll('.comments-items');
    for (let i = commentsItems.length - 1; i >= 0; i--) {
        commentsItems[i].remove();
    }

    const pItems = articleShow.querySelectorAll('.p-items');
    for (let i = pItems.length - 1; i >= 0; i--) {
        pItems[i].remove();
    }

    const li = articleShow.querySelectorAll('li');
    for (let i = li.length - 1; i >= 0; i--) {
        li[i].remove();
    }

    articleShow.style.display = 'none';
    bottomTab.style = '';
    if (backControl == 0) {
        mainPage.style = '';
        document.documentElement.scrollTop = nowScrollTop;
        console.log(nowScrollTop);
    } else if (backControl == 1) {
        bigContainer[4].style.display = 'block';
        personalCenter.style = '';
    } else if (backControl == 2) {
        bigContainer[5].style.display = 'block';
        myMessage.style = '';
    } else if (backControl == 3) {
        bigContainer[4].style.display = 'block';
        myMessage.style = '';
    } else if (backControl == 4) {
        personalCenter.style = 'block';
        document.documentElement.scrollTop = nowScrollTop;
    } else if (backControl == 5) {
        otherPage.style.display = 'block';
        bottomTab.style.display = 'none';
        document.documentElement.scrollTop = nowScrollTop;
    } else if (backControl == 6) {
        bigContainer[2].style = 'block';
        mainPage.style.display = 'block';
        bottomTab.style = '';
    }
    nowstep = 0;
    nowReviewPages = 1;
    const pictureContainer = document.querySelector('.picture-container');
    pictureContainer.style.transform = 'translateX(0vw)';
}

btn1.onclick = function () {
    // console.log('test');
    const xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.open('POST', 'http://175.178.193.182:8080/logout');

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send("userId=" + 49);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {

                console.log(xhr.response);
                // personalCenter.style.display = 'none';
                // bottomTab.style.display = 'none';
                // loginPage.style = '';

            } else {

            }
        }
    }
}

const postArticle = document.querySelector('.post-article');
const backHome = document.querySelector('#back-home');
const imageClick = document.querySelector('.upload-image');

//发布文章页面
btn2.onclick = function () {
    animate1(postArticle, 0, function () {
        // mainPage.style.display = 'none';
        // bigContainer[0].style.top = 0;
    });
    bigContainer[0].style.zIndex = '1';
}

//返回首页
backHome.onclick = function () {
    // mainPage.style = '';
    animate2(postArticle, 100, function () {
        bigContainer[0].style.zIndex = '-1';
    })
    // bigContainer[0].style.top = '-4vh';
}

//上传图片
let picArr = new Array();
imageClick.onclick = function () {
    images.click();
}
let lastIcon = document.querySelector('.upload-image').querySelector('.iconfont');
const firstIcon = document.querySelector('.upload-image').querySelector('.iconfont');
images.onclick = function () {
    images.onchange = function () {

        let image = images.files[0];
        let formData = new FormData();
        formData.append('image', image);

        const xhr = new XMLHttpRequest();

        xhr.responseType = 'json';

        xhr.open('POST', 'http://175.178.193.182:8080/upload/image');

        xhr.send(formData);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log(xhr.status);
                    console.log(xhr.response);
                    const last = document.querySelectorAll('.upload-picture');
                    const lastOne = last[last.length - 1];

                    if (xhr.response.url != undefined) {
                        lastOne.src = xhr.response.url;

                        const box = document.querySelector('.upload-image');

                        const next = document.createElement('div');
                        const icon = document.createElement('i');
                        icon.className = 'iconfont';
                        icon.innerHTML = '&#xe7b7;';
                        next.appendChild(icon);
                        lastIcon.style = '';
                        icon.style.display = 'none';
                        lastIcon = icon;
                        icon.addEventListener('click', (e) => {
                            e.stopPropagation();
                            icon.parentNode.remove();
                            console.log(1);
                        })
                        const img = document.createElement('img');
                        box.appendChild(next);
                        next.appendChild(img);
                        img.className = 'upload-picture';
                    }

                } else {

                }
            }
        }
    }
}

firstIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    firstIcon.parentNode.remove();
    console.log(1);
})

//带话题界面
const bringTags = document.getElementById('tags');
const tagsPage = document.querySelector('.background');
const tagsSend = document.getElementById('send-tags');
let tagsArr = new Array();
bringTags.onclick = function () {
    tagsPage.style = '';
    tagsSend.focus();
}
//取消带话题
const tagsCancel = document.getElementById('cancel');
tagsCancel.onclick = function () {
    tagsPage.style.display = 'none';
}
//确认带话题
const tagsConfirm = document.getElementById('confirm');
const tagsShow = document.querySelector('.tagsShow');
tagsConfirm.onclick = function () {
    const tagsText = tagsSend.value;
    if (tagsText != '') {
        let item = document.createElement('div');
        tagsShow.appendChild(item);
        item.innerHTML = '#' + tagsText;
        tagsSend.value = '';
    }
    // console.log(tagsText);
    tagsPage.style.display = 'none';
}
//删除带话题

//发布文章
const postTitle = document.getElementById('post-title');
const postContent = document.getElementById('post-content');
const postIt = document.getElementsByClassName('postit')[0];
postIt.onclick = function () {
    let tagsLength = document.querySelector('.tagsShow').querySelectorAll('div');
    //console.log(tagsLength[0].innerHTML);
    let picsLength = document.querySelectorAll('.upload-picture');

    for (let i = 0; i <= picsLength.length - 2; i++) {
        picArr.push(picsLength[i].src);
    }

    for (let i = 0; i < tagsLength.length; i++) {

        tagsArr.push(tagsLength[i].innerHTML.slice(1));

    }
    console.log(postTitle.value);
    console.log(postContent.value);
    console.log(picArr);
    console.log(tagsArr);
    if (postTitle.value == '' || postContent.value == '') {

    } else {
        axios.post('http://175.178.193.182:8080/article', {
            "userId": 49,
            "title": postTitle.value,
            "content": postContent.value,
            "tags": tagsArr,
            "images": picArr
        })
            .then(function (response) {
                console.log(response);
                const first = document.getElementsByClassName('upload-picture')[0];
                first.src = '';
                postTitle.value = '';
                postContent.value = '';
                const upImage = document.querySelector('.upload-image').querySelectorAll('div');
                for (let i = upImage.length - 1; i >= 1; i--) {
                    upImage[i].remove();
                }
                const tags = document.querySelector('.tagsShow').querySelectorAll('div');
                for (let j = tags.length - 1; j >= 0; j--) {
                    tags[j].remove();
                }
                backHome.click();
            })
            .catch(function (error) {
                console.log(error);
            });
        tagsArr.length = 0;
        picArr.length = 0;
    }
}

const mainpage = document.getElementsByClassName('bottom-tab')[0].getElementsByTagName('div')[0];
const mymessage = document.getElementsByClassName('bottom-tab')[0].getElementsByTagName('div')[1];
const personalcenter = document.getElementsByClassName('bottom-tab')[0].getElementsByTagName('div')[2];
//首页界面
var loadArticleType = '推荐';
mainpage.onclick = function () {
    mainpage.className = 'focus';
    mainPage.style = '';

    mymessage.className = '';
    myMessage.style.display = 'none';

    personalcenter.className = '';
    personalCenter.style.display = 'none';

    document.documentElement.scrollTop = nowScrollTop;
}

for (let i = 0; i < navButton.length; i++) {
    navButton[i].onclick = function () {
        const mItems = document.querySelectorAll('.m-items');
        for (let i = mItems.length - 1; i >= 0; i--) {
            mItems[i].remove();
        }
        nowpages = 0;
        lastpages = 0;
        columnOne = 0;
        columnTwo = 0;
        column1 = 0;
        column2 = 0;
        loadArticleType = this.getAttribute('data-index');
        console.log(loadArticleType);
        for (let j = 0; j < navButton.length; j++) {
            navButton[j].className = '';
        }
        this.className = 'focus';
        var objects = {
            url: 'http://175.178.193.182:8080/article/getHomePageTag',
            data: {
                tag: loadArticleType,
                pages: nowpages
            },
            success: function (data, xhr) {
                console.log('这里是success函数');
                const recommend = data.articles;

                for (let i = 0; i < recommend.length; i++) {

                    let count = 0;

                    if (columnOne > columnTwo) {
                        count = 1;
                    } else {
                        count = 0;
                    }
                    let mcontainer = document.querySelectorAll('.m-column')[count];
                    addBox(mcontainer);
                    let putIn = mcontainer.querySelectorAll('.m-items')[count ? column2 : column1];
                    let putimage = putIn.querySelector('.picture');
                    let puth3 = putIn.querySelector('h3');
                    let putavatar = putIn.querySelector('.avatar1');
                    let putspan = putIn.querySelectorAll('span');
                    putIn.setAttribute('data-articleId', recommend[i].articleId)
                    putimage.src = recommend[i].images[0];
                    puth3.innerHTML = recommend[i].title;
                    putavatar.src = recommend[i].avatar;
                    putspan[0].innerHTML = recommend[i].authorName;
                    putspan[1].className = 'iconfont';
                    if (recommend[i].likerList.indexOf(userId) != -1) {
                        putspan[1].innerHTML = '&#xe613;';
                        putspan[1].style.color = 'red';

                    } else {
                        putspan[1].innerHTML = '&#xe614;';
                    }
                    putspan[2].innerHTML = recommend[i].likes;

                    let gaodu = putIn.offsetHeight;

                    if (count == 0) {
                        columnOne += gaodu;
                        column1++;
                    } else {
                        columnTwo += gaodu;
                        column2++;
                    }
                    console.log(columnOne);
                    console.log(columnTwo);
                }
                nowpages++;
            },
            // 请求失败后的函数
            error: function (data, xhr) {
                console.log('这里是error函数' + data);
                console.log(xhr);
            }
        }
        ajax(objects);

    }
}

//我的消息界面
mymessage.onclick = function () {
    mainpage.className = '';
    mainPage.style.display = 'none';

    mymessage.className = 'focus';
    myMessage.style.display = '';

    personalcenter.className = '';
    personalCenter.style.display = 'none';
}
//个人中心界面
personalcenter.onclick = function () {
    mainpage.className = '';
    mainPage.style.display = 'none';

    mymessage.className = '';
    myMessage.style.display = 'none';

    personalcenter.className = 'focus';
    personalCenter.style = '';
    myPage.click();
    otherClickControl = 0;
}

const bigContainer = document.getElementsByClassName('big-container');
const edit = document.getElementsByClassName('edit')[0];
const editMessage = document.getElementsByClassName('edit-message')[0];
const back = document.getElementById('return');
//弹入动画
function animate1(obj, target, callback) {
    var step = 100;      //左右滑动
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {

        if (step === target) {
            clearInterval(obj.timer);
            callback && callback();
        }
        obj.style.transform = 'translateX(' + step + 'vw)';
        step -= 2;
    }, 1);
}
//弹出动画
function animate2(obj, target, callback) {
    var step = 0;      //左右滑动
    clearInterval(obj.timer1);
    obj.timer1 = setInterval(function () {

        if (step === target) {
            clearInterval(obj.timer1);
            callback && callback();
        }
        obj.style.transform = 'translateX(' + step + 'vw)';
        step += 2;
    }, 1);
}

window.onscroll = function () {
    let top = document.documentElement.scrollTop;
    // bigContainer[1].style.top = top + 'px';
}
//编辑资料框弹入
edit.onclick = function () {
    animate1(editMessage, 0, function () {
        // personalCenter.style.display = 'none';
        // bigContainer[1].style.top = 0;
    });
    bigContainer[1].style.zIndex = '1';
}

//编辑资料信息框 弹入
const eMessage = document.querySelector('.e-container').querySelectorAll('.e-message');
const editMask = document.querySelector('.edit-mask');
var _thisChange = null;
for (let i = 0; i < eMessage.length - 1; i++) {
    eMessage[i].onclick = function () {
        editMask.style = '';
        _thisChange = this;
    }
}
//弹出
const editCancel = document.querySelector('.edit-cancel');
editCancel.onclick = function () {
    editMask.style.display = 'none';
    editText.value = '';
}

const editText = document.getElementById('edit-text');
const editStore = document.querySelector('.edit-store');
var storeStatus = false;   //检测是否能将信息保存
editText.oninput = function () {
    if (this.value != '') {
        editStore.style.color = 'rgb(255, 80, 80)';
        storeStatus = true;
    } else {
        editStore.style = '';
        storeStatus = false;
    }
}
//保存并修改资料
editStore.onclick = function () {
    if (storeStatus) {
        _thisChange.querySelectorAll('div')[1].innerHTML = editText.value;
        let myName = document.getElementById('my-editname').innerHTML;
        let mySex = document.getElementById('my-sex').innerHTML;
        let myBirth = document.getElementById('my-birthday').innerHTML;
        let myRegion = document.getElementById('my-region').innerHTML;
        let myIntro = document.getElementById('my-intro').innerHTML;
        axios.post('http://175.178.193.182:8080/user/edit', {
            userId: userId,
            nickname: myName,
            gender: mySex,
            birthday: myBirth,
            area: myRegion,
            profession: '',
            description: myIntro
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        editText.value = '';
        editMask.style.display = 'none';
        storeStatus = false;
        editStore.style.color = 'rgba(255, 80, 80,.6)';
    }
}

//编辑资料框弹出
back.onclick = function () {
    // personalCenter.style = '';
    animate2(editMessage, 100, function () {
        bigContainer[1].style.zIndex = '-1';
    })
    // bigContainer[1].style.top = '-4vh';
}

//搜索框弹入
const searchingPage = document.querySelector('.searching');
const searchBack = document.getElementById('search-back');
const searchingButton = document.getElementsByClassName('top-idea')[0].getElementsByTagName('div')[2];
searchingButton.onclick = function () {
    console.log(1);
    animate1(searchingPage, 0, function () {
        // mainPage.style.visibility = 'hidden';
        // bigContainer[1].style.top = 0;

    });
    bigContainer[2].style.zIndex = '1';
    // bigContainer[2].style.position = 'absolute';
}
const searchTips = document.querySelector('.search-tips');
//搜索框弹出
searchBack.onclick = function () {
    // personalCenter.style = '';
    animate2(searchingPage, 100, function () {
        bigContainer[2].style.zIndex = '-1';
        const searchArticle = document.getElementById('search-article');
        let nowColumn = searchArticle.getElementsByClassName('m-column');
        let nowLength1 = nowColumn[0].querySelectorAll('.m-items');
        let nowLength2 = nowColumn[1].querySelectorAll('.m-items');
        let nowLength3 = searchUser.querySelectorAll('.s-items');
        for (let i = nowLength3.length - 1; i >= 0; i--) {
            nowLength3[i].remove();
            console.log(i);
        }
        console.log(nowLength1);
        for (let i = nowLength1.length - 1; i >= 0; i--) {
            nowLength1[i].remove();
            console.log(i);
        }
        for (let i = nowLength2.length - 1; i >= 0; i--) {
            nowLength2[i].remove();
        }
        const searching = document.getElementById('searching');
        searching.value = '';
        searchTips.style.display = 'none';
    })
    // bigContainer[1].style.top = '-4vh';
    // personalCenter.style.visibility = 'visible';
}

const searchNav = document.querySelector('.search-nav').querySelectorAll('div');
const searchArticle = document.getElementById('search-article');
const searchUser = document.getElementById('search-user');
for (let i = 0; i < 2; i++) {
    searchNav[i].onclick = function () {
        this.classList.add("personal-focus");
        if (i) {
            searchNav[i - 1].classList.remove("personal-focus");
            searchArticle.style.display = 'none';
            searchUser.style = '';
        } else {
            searchNav[i + 1].classList.remove("personal-focus");
            searchArticle.style = '';
            searchUser.style.display = 'none';
        }
    }
}

//搜索用户 进入主页 关注
searchUser.addEventListener('click', (e) => {
    if (e.target && e.target.className == 's-avatar') {
        console.log('头像');
        otherControl = 3;

        const oid = e.target.getAttribute('data-userid');
        bigContainer[2].style.display = 'none';
        mainPage.style.display = 'none';
        bottomTab.style.display = 'none';
        otherPage.style = '';
        getOtherMessage(oid);
        document.documentElement.scrollTop = 0;
        oPage.click();
    } else if (e.target && e.target.getAttribute('data-followerid')) {
        console.log('关注');
        const followerId = e.target.getAttribute('data-followerid');
        axios.post('http://175.178.193.182:8080/user/follow', {
            userId: userId,
            followerId: followerId
        })
            .then(function (response) {
                console.log(response);
                if (response.data.status >= 300) {
                    axios.post('http://175.178.193.182:8080/user/cancelFollow', {
                        userId: userId,
                        followerId: followerId
                    })
                        .then(function (response) {
                            console.log(response);
                            e.target.innerHTML = '未关注';
                            e.target.className = 'if-follow';
                        })
                        .catch(function (error) {
                            console.log(error);

                        });
                } else {
                    e.target.innerHTML = '已关注';
                    e.target.className = 'ff-follow';
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
})

//上传头像
avatar.onclick = function () {
    upload.click();

}
upload.onclick = function () {

    upload.onchange = function () {
        var file = upload.files[0];
        var formData = new FormData();
        formData.append('userId', userId);
        formData.append('avatar', file);

        console.log(formData);
        const xhr = new XMLHttpRequest();

        xhr.open('POST', 'http://175.178.193.182:8080/user/upload');

        xhr.send(formData);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log(xhr.status);
                    console.log(xhr.statusText);
                    console.log(xhr.getAllResponseHeaders());
                    console.log(xhr.response);
                    getMessage();

                } else {

                }
            }
        }
    }
}
//上传背景图
const bgImage = document.querySelector('.bg-image');
const uploadbgImage = document.getElementById('uploadbgImage');
const backgroundPicture = bgImage.querySelector('img');
bgImage.onclick = function () {
    uploadbgImage.click();
}
uploadbgImage.onclick = function () {

    uploadbgImage.onchange = function () {
        var file = uploadbgImage.files[0];
        var formData = new FormData();
        formData.append('userId', userId);
        formData.append('backGroundPicture', file);
        console.log(file);
        console.log(formData);
        const xhr = new XMLHttpRequest();

        xhr.open('POST', 'http://175.178.193.182:8080/user/upload');

        xhr.responseType = 'json';

        xhr.send(formData);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log(xhr.status);
                    console.log(xhr.statusText);
                    console.log(xhr.response);
                    // getMessage();
                    backgroundPicture.src = xhr.response.backGroundPicture;
                } else {

                }
            }
        }
    }
}

//搜索文章或作者
const clickToSearch = document.getElementById('click-search');
let searchxhr = null;
let searchIsSending = false;
let searchUserxhr = null;
let searchUserIsSending = false;
clickToSearch.onclick = function () {
    let columnOne = 0;       //高度计数器
    let columnTwo = 0;
    let column1 = 0;
    let column2 = 0;

    const searching = document.getElementById('searching').value;
    let nowColumn = searchArticle.getElementsByClassName('m-column');
    let nowLength1 = nowColumn[0].querySelectorAll('.m-items');
    let nowLength2 = nowColumn[1].querySelectorAll('.m-items');
    console.log(nowLength1);
    for (let i = nowLength1.length - 1; i >= 0; i--) {
        nowLength1[i].remove();
    }
    for (let i = nowLength2.length - 1; i >= 0; i--) {
        nowLength2[i].remove();
    }
    //搜索文章

    if (searchIsSending) searchxhr.abort();

    searchxhr = new XMLHttpRequest();

    searchIsSending = true;

    searchxhr.responseType = 'json';

    searchxhr.open('get', 'http://175.178.193.182:8080/search/byArticle?keyWord=' + searching);

    searchxhr.send();

    searchxhr.onreadystatechange = function () {
        if (searchxhr.readyState === 4) {
            searchIsSending = false;
            console.log(searchxhr.response);
            const searchingCount = searchxhr.response.articles;
            console.log(searchingCount);

            if (searchingCount == 0) {
                searchTips.style.display = 'block';
            } else {
                searchTips.style.display = 'none';
                for (let i = 0; i < searchingCount.length; i++) {
                    // (function (i) {
                    let count = 0;

                    // console.log(columnOne);
                    if (columnOne > columnTwo) {
                        count = 1;

                    } else {
                        count = 0;
                    }
                    let mcontainer = searchArticle.querySelectorAll('.m-column')[count];
                    addBox(mcontainer);
                    let putIn = mcontainer.querySelectorAll('.m-items')[count ? column2 : column1];
                    let putimage = putIn.querySelector('.picture');
                    let puth3 = putIn.querySelector('h3');
                    let putavatar = putIn.querySelector('.avatar1');
                    let putspan = putIn.querySelectorAll('span');
                    putIn.setAttribute('data-articleId', searchingCount[i].articleId)
                    putimage.src = searchingCount[i].images[0];
                    puth3.innerHTML = searchingCount[i].title;
                    putavatar.src = searchingCount[i].avatar;
                    putspan[0].innerHTML = searchingCount[i].authorName;
                    putspan[1].innerHTML = '♥';
                    putspan[2].innerHTML = searchingCount[i].likes;
                    // console.log(putimage.offsetHeight);

                    // while(!putimage.complete){
                    // delay(1);
                    // }
                    let gaodu = putIn.offsetHeight;
                    // console.log(gaodu);
                    if (count == 0) {
                        columnOne += gaodu;
                        column1++;
                    } else {
                        columnTwo += gaodu;
                        column2++;
                    }
                }
            }
        }
    }
    //搜索作者
    if (searchUserIsSending) searchUserxhr.abort();

    searchUserxhr = new XMLHttpRequest();

    searchUserIsSending = true;

    searchUserxhr.responseType = 'json';

    searchUserxhr.open('get', 'http://175.178.193.182:8080/search/byuser?keyWord=' + searching);

    searchUserxhr.send();

    searchUserxhr.onreadystatechange = function () {
        if (searchUserxhr.readyState === 4) {
            searchUserIsSending = false;
            const searchingUserCount = searchUserxhr.response.users;
            let nowLength3 = searchUser.querySelectorAll('.s-items');
            for (let i = nowLength3.length - 1; i >= 0; i--) {
                nowLength3[i].remove();
                console.log(i);
            }

            console.log(searchingUserCount);

            if (searchingUserCount == 0) {
                // searchTips.style.display = 'block';
            } else {
                // searchTips.style.display = 'none';
                for (let i = 0; i < searchingUserCount.length; i++) {

                    let item = document.createElement('div');
                    item.className = 's-items';
                    searchUser.appendChild(item);
                    let message = document.createElement('div');
                    message.className = 's-message';
                    item.appendChild(message);
                    let img = document.createElement('img');
                    img.className = 's-avatar';
                    message.appendChild(img);
                    let box = document.createElement('div');
                    box.className = 's-box';
                    message.appendChild(box);
                    let name = document.createElement('div');
                    name.className = 's-name';
                    box.appendChild(name);
                    let intro = document.createElement('div');
                    intro.className = 's-intro';
                    box.appendChild(intro);
                    let follow = document.createElement('div');
                    follow.className = 'if-follow';
                    item.appendChild(follow);

                    img.setAttribute('data-userId', searchingUserCount[i].userId);
                    follow.setAttribute('data-followerId', searchingUserCount[i].userId);
                    img.src = searchingUserCount[i].avatar;
                    name.innerHTML = searchingUserCount[i].nickname;
                    intro.innerHTML = searchingUserCount[i].description;
                    follow.innerHTML = '未关注';

                    var objects = {
                        url: 'http://175.178.193.182:8080/user/fullInfo',
                        data: {
                            userId: searchingUserCount[i].userId
                        },
                        success: function (data, xhr) {
                            console.log('这里是success函数');
                            const user = data.user;

                            if (user.fans.indexOf(userId) != -1) {
                                follow.innerHTML = '已关注';
                                follow.className = 'ff-follow';
                                if (user.follows.indexOf(userId) != -1) {
                                    follow.innerHTML = '互相关注';
                                }
                            }
                        },
                        // 请求失败后的函数
                        error: function (data, xhr) {
                            console.log('这里是error函数' + data);
                            console.log(xhr);
                        }
                    }
                    ajax(objects);
                }
            }
        }
    }
}

//关注粉丝页弹入
const followFans = document.querySelector('.follow-fans');
function ffMoveIn() {
    animate1(followFans, 0);
    bigContainer[3].style.zIndex = '1';
}
const forf = document.getElementById('forf');
//关注弹入
const clickFollow = document.querySelector('.follows');
clickFollow.onclick = function () {
    forf.innerHTML = '关注的人';
    console.log(1);
    ffMoveIn();
    addFollowFans(true);
}
//我的消息里的关注弹入
var otherClickControl = 0;
const clickToFollow = document.querySelector('.follow');
clickToFollow.onclick = function () {
    otherClickControl = 1;
    clickFollow.click();
}
//粉丝弹入
const clickFan = document.querySelector('.fans');
clickFan.onclick = function () {
    forf.innerHTML = '粉丝';
    console.log(2);
    ffMoveIn();
    addFollowFans(false);
}
//添加关注/粉丝盒子
function addFollowFans(bool) {
    axios.get('http://175.178.193.182:8080/user/fullInfo?userId=' + userId)
        .then(function (response) {
            console.log(response);
            let followers = null;
            if (bool) {
                followers = response.data.user.follows;
            } else {
                followers = response.data.user.fans;
            }
            for (let i = 0; i < followers.length; i++) {
                const fContainer = document.querySelector('.ff-container');
                const fItems = document.createElement('div');
                fItems.className = 'ff-items';
                fContainer.appendChild(fItems);
                const fBox = document.createElement('div');
                fBox.className = 'ff-box';
                const fFollow = document.createElement('div');

                fItems.appendChild(fBox);
                fItems.appendChild(fFollow);
                const fAvatar = document.createElement('div');
                fAvatar.className = 'ff-avatar';
                const fName = document.createElement('div');
                fName.className = 'ff-name';
                fBox.appendChild(fAvatar);
                fBox.appendChild(fName);
                const img = document.createElement('img');
                img.setAttribute('data-otherId', followers[i]);
                fAvatar.appendChild(img);

                axios.get('http://175.178.193.182:8080/user/fullInfo?userId=' + followers[i])
                    .then(function (response) {
                        console.log(response);
                        const user = response.data.user;
                        if (bool) {
                            if (user.follows.indexOf(userId) == -1) {
                                fFollow.innerHTML = '已关注';
                                fFollow.className = 'ff-follow';
                            } else {
                                fFollow.innerHTML = '互相关注';
                                fFollow.className = 'ff-follow';
                            }
                        } else {
                            if (user.fans.indexOf(userId) == -1) {
                                fFollow.innerHTML = '未关注';
                                fFollow.className = 'no-follow';
                            } else {
                                fFollow.innerHTML = '互相关注';
                                fFollow.className = 'ff-follow';
                            }
                        }
                        fFollow.setAttribute('data-followerId', user.userId);
                        fName.innerHTML = user.nickname;
                        img.src = user.avatar;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

const fContainer = document.querySelector('.ff-container');
fContainer.addEventListener('click', function (e) {
    //关注与取关
    if (e.target && e.target.getAttribute('data-followerId')) {
        const followerId = e.target.getAttribute('data-followerId');
        axios.post('http://175.178.193.182:8080/user/follow', {
            userId: userId,
            followerId: followerId
        })
            .then(function (response) {
                console.log(response);
                if (response.data.status >= 300) {
                    axios.post('http://175.178.193.182:8080/user/cancelFollow', {
                        userId: userId,
                        followerId: followerId
                    })
                        .then(function (response) {
                            console.log(response);
                            e.target.innerHTML = '未关注';
                            e.target.className = 'no-follow';
                        })
                        .catch(function (error) {
                            console.log(error);

                        });
                } else {
                    e.target.innerHTML = '已关注';
                    e.target.className = 'ff-follow';
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    //跳转他人主页
    else if (e.target && e.target.getAttribute('data-otherId')) {
        otherControl = 0;
        console.log(e.target.getAttribute('data-otherId'));
        const oid = e.target.getAttribute('data-otherId');
        if (otherClickControl) {
            otherControl = 2;
            otherPage.style = '';
            bigContainer[3].style.display = 'none';
            myMessage.style.display = 'none';
            bottomTab.style.display = 'none';

        } else {
            otherPage.style = '';
            bigContainer[3].style.display = 'none';
            bottomTab.style.display = 'none';
            personalCenter.style.display = 'none';

        }
        getOtherMessage(oid);
        oPage.click();
    }
})

//他人主页返回
const otherBack = document.getElementById('return-back');
otherBack.onclick = function () {

    otherPage.style.display = 'none';
    //个人主页关注进入后返回
    if (otherControl == 0) {

        bigContainer[3].style.display = 'block';
        bottomTab.style = '';
        personalCenter.style = '';
    }
    //文章评论进入后返回
    else if (otherControl == 1) {
        articleShow.style = '';
    }
    //我的消息关注进入后返回
    else if (otherControl == 2) {
        bigContainer[3].style.display = 'block';
        bottomTab.style = '';
        myMessage.style = '';
    } else if (otherControl == 3) {
        bigContainer[2].style.display = 'block';
        bottomTab.style = '';
        mainPage.style = '';
    }
}

//关注粉丝页弹出
const returnPersonal = document.getElementById('return-personal');
returnPersonal.onclick = function () {
    animate2(followFans, 100, function () {
        bigContainer[3].style.zIndex = '-1';
    })
    const fItems = document.querySelectorAll('.ff-items');
    for (let i = fItems.length - 1; i >= 0; i--) {
        fItems[i].remove();
    }
}

//获赞与收藏
// const lasNav = document.querySelector('.top-box').querySelectorAll('div');

// for (let i = 0; i < 2; i++) {
//     lasNav[i].onclick = function () {
//         if(i) {
//             this.classList.add('personal-focus');
//             lasNav[0].classList.remove('personal-focus');
//         } else {
//             this.classList.add('personal-focus');
//             lasNav[1].classList.remove('personal-focus');
//         }
//     }
// }
const clickLikeStar = document.querySelector('.likes-stars');
const likeAndStar = document.querySelector('.like-and-star');
const getLike = document.querySelector('.get-like');
const getStar = document.querySelector('.get-star');
//获赞收藏页弹入
clickLikeStar.onclick = function () {
    animate1(likeAndStar, 0, function () {
        getLike.click();
    });
    bigContainer[4].style.zIndex = '1';
}
//我的消息里的赞和收藏
const clickToLikeStar = document.querySelector('.like-star');
clickToLikeStar.onclick = function () {
    animate1(likeAndStar, 0, function () {
        getLike.classList.add('personal-focus');
        getStar.classList.remove('personal-focus');
        const lasItems = document.querySelectorAll('.las-items');
        for (let i = lasItems.length - 1; i >= 0; i--) {
            lasItems[i].remove();
        }
        axios.get('http://175.178.193.182:8080/notice/article/like?userId=' + userId)
            .then(function (response) {
                console.log(response);
                const likeList = response.data.like;
                for (let i = 0; i < likeList.length; i++) {
                    const lasContainer = document.querySelector('.las-container');
                    const lasItems = document.createElement('div');
                    lasItems.className = 'las-items';
                    lasItems.setAttribute('data-articleId', likeList[i].articleInfo.articleId);
                    lasContainer.appendChild(lasItems);
                    console.log(likeList[i].userInfo.nickname);
                    const lasBox = document.createElement('div');
                    lasBox.className = 'las-box';
                    const arPicture = document.createElement('div');
                    arPicture.className = 'ar-picture';
                    lasItems.appendChild(lasBox);
                    lasItems.appendChild(arPicture);
                    const lasAvatar = document.createElement('div');
                    lasAvatar.className = 'las-avatar';
                    const lasName = document.createElement('div');
                    lasName.className = 'las-name';
                    const div1 = document.createElement('div');
                    lasBox.appendChild(lasAvatar);
                    lasBox.appendChild(lasName);
                    lasBox.appendChild(div1);
                    div1.innerHTML = '赞了你的笔记';
                    const img1 = document.createElement('img');
                    const img2 = document.createElement('img');
                    lasAvatar.appendChild(img1);
                    arPicture.appendChild(img2);
                    img1.src = likeList[i].userInfo.avatar;
                    img1.setAttribute('data-userid', likeList[i].userInfo.userId);
                    lasName.innerHTML = likeList[i].userInfo.nickname;
                    img2.src = likeList[i].articleInfo.images[0];
                }
                toArticleorAuthor3();
            })
            .catch(function (error) {
                console.log(error);
            });
    });
    bigContainer[4].style.zIndex = '1';
}
function toArticleorAuthor3() {

    const lasContainer = document.querySelector('.las-container');
    const lasItems = lasContainer.getElementsByClassName('las-items');
    for (let i = 0; i < lasItems.length; i++) {
        lasItems[i].onclick = function () {
            console.log(1);
            const aid = this.getAttribute('data-articleId');
            nowArticleId = aid;
            bigContainer[4].style.display = 'none';
            articleShow.style = '';
            myMessage.style.display = 'none';
            bottomTab.style.display = 'none';
            loadArticleShow(aid);
            backControl = 3;
        }
    }
    const lasAvatar = lasContainer.getElementsByClassName('las-avatar');
    for (let i = 0; i < lasAvatar.length; i++) {
        lasAvatar[i].addEventListener('click', function (e) {
            console.log(2);
            e.stopPropagation();
        })
    }

}

getLike.onclick = function () {
    this.classList.add('personal-focus');
    getStar.classList.remove('personal-focus');
    const lasItems = document.querySelectorAll('.las-items');
    for (let i = lasItems.length - 1; i >= 0; i--) {
        lasItems[i].remove();
    }
    axios.get('http://175.178.193.182:8080/notice/article/like?userId=' + userId)
        .then(function (response) {
            console.log(response);
            const likeList = response.data.like;
            for (let i = 0; i < likeList.length; i++) {
                const lasContainer = document.querySelector('.las-container');
                const lasItems = document.createElement('div');
                lasItems.className = 'las-items';
                lasItems.setAttribute('data-articleId', likeList[i].articleInfo.articleId);
                lasContainer.appendChild(lasItems);
                console.log(likeList[i].userInfo.nickname);
                const lasBox = document.createElement('div');
                lasBox.className = 'las-box';
                const arPicture = document.createElement('div');
                arPicture.className = 'ar-picture';
                lasItems.appendChild(lasBox);
                lasItems.appendChild(arPicture);
                const lasAvatar = document.createElement('div');
                lasAvatar.className = 'las-avatar';
                const lasName = document.createElement('div');
                lasName.className = 'las-name';
                const div1 = document.createElement('div');
                lasBox.appendChild(lasAvatar);
                lasBox.appendChild(lasName);
                lasBox.appendChild(div1);
                div1.innerHTML = '赞了你的笔记';
                const img1 = document.createElement('img');
                const img2 = document.createElement('img');
                lasAvatar.appendChild(img1);
                arPicture.appendChild(img2);
                img1.src = likeList[i].userInfo.avatar;
                lasName.innerHTML = likeList[i].userInfo.nickname;
                img2.src = likeList[i].articleInfo.images[0];
            }
            toArticleorAuthor();
        })
        .catch(function (error) {
            console.log(error);
        });

}

getStar.onclick = function () {
    this.classList.add('personal-focus');
    getLike.classList.remove('personal-focus');
    const lasItems = document.querySelectorAll('.las-items');
    for (let i = lasItems.length - 1; i >= 0; i--) {
        lasItems[i].remove();
    }
    axios.get('http://175.178.193.182:8080/notice/article/star?userId=' + userId)
        .then(function (response) {
            console.log(response);
            const likeList = response.data.star;
            for (let i = 0; i < likeList.length; i++) {
                const lasContainer = document.querySelector('.las-container');
                const lasItems = document.createElement('div');
                lasItems.className = 'las-items';
                lasItems.setAttribute('data-articleId', likeList[i].articleInfo.articleId);
                lasContainer.appendChild(lasItems);
                console.log(likeList[i].userInfo.nickname);
                const lasBox = document.createElement('div');
                lasBox.className = 'las-box';
                const arPicture = document.createElement('div');
                arPicture.className = 'ar-picture';
                lasItems.appendChild(lasBox);
                lasItems.appendChild(arPicture);
                const lasAvatar = document.createElement('div');
                lasAvatar.className = 'las-avatar';
                const lasName = document.createElement('div');
                lasName.className = 'las-name';
                const div1 = document.createElement('div');
                lasBox.appendChild(lasAvatar);
                lasBox.appendChild(lasName);
                lasBox.appendChild(div1);
                div1.innerHTML = '收藏了你的笔记';
                const img1 = document.createElement('img');
                const img2 = document.createElement('img');
                lasAvatar.appendChild(img1);
                arPicture.appendChild(img2);
                img1.src = likeList[i].userInfo.avatar;
                lasName.innerHTML = likeList[i].userInfo.nickname;
                img2.src = likeList[i].articleInfo.images[0];
            }
            toArticleorAuthor();
        })
        .catch(function (error) {
            console.log(error);
        });
}
//个人主页获赞收藏前往文章
function toArticleorAuthor() {

    const lasContainer = document.querySelector('.las-container');
    const lasItems = lasContainer.getElementsByClassName('las-items');
    for (let i = 0; i < lasItems.length; i++) {
        lasItems[i].onclick = function () {
            console.log(1);
            const aid = this.getAttribute('data-articleid');
            nowArticleId = aid;
            bigContainer[4].style.display = 'none';
            articleShow.style = '';
            personalCenter.style.display = 'none';
            bottomTab.style.display = 'none';
            loadArticleShow(aid);

            backControl = 1;
        }
    }
    const lasAvatar = lasContainer.getElementsByClassName('las-avatar');
    for (let i = 0; i < lasAvatar.length; i++) {
        lasAvatar[i].addEventListener('click', function (e) {
            console.log(2);
            e.stopPropagation();
        })
    }
}

//获赞收藏页弹出
const returnToPersonal = document.getElementById('return-to-personal');
returnToPersonal.onclick = function () {
    animate2(likeAndStar, 100, function () {
        bigContainer[4].style.zIndex = '-1';
    })
    const lasItems = document.querySelectorAll('.las-items');
    for (let i = lasItems.length - 1; i >= 0; i--) {
        lasItems[i].remove();
    }
}

const reviewAndAt = document.querySelector('.review-and-at');
//评论和@页弹入
const clickReview = document.querySelector('.review');
clickReview.onclick = function () {
    animate1(reviewAndAt, 0);
    bigContainer[5].style.zIndex = '1';
    axios.get('http://175.178.193.182:8080/notice/comment?userId=' + userId)
        .then(function (response) {
            console.log(response);
            const likeList = response.data.like;
            for (let i = 0; i < likeList.length; i++) {
                const lasContainer = document.querySelector('.raa-container');
                const lasItems = document.createElement('div');
                lasItems.className = 'raa-items';
                lasItems.setAttribute('data-articleId', likeList[i].articleInfo.articleId);
                lasContainer.appendChild(lasItems);
                console.log(likeList[i].userInfo.nickname);
                const lasBox = document.createElement('div');
                lasBox.className = 'raa-box';
                const arPicture = document.createElement('div');
                arPicture.className = 'ar-picture';
                lasItems.appendChild(lasBox);
                lasItems.appendChild(arPicture);
                const lasAvatar = document.createElement('div');
                lasAvatar.className = 'raa-avatar';
                const lasName = document.createElement('div');
                lasName.className = 'raa-name';
                const div1 = document.createElement('div');
                lasBox.appendChild(lasAvatar);
                lasBox.appendChild(lasName);
                lasBox.appendChild(div1);
                div1.innerHTML = '评论了你的笔记';
                const img1 = document.createElement('img');
                const img2 = document.createElement('img');
                lasAvatar.appendChild(img1);
                arPicture.appendChild(img2);
                img1.src = likeList[i].userInfo.avatar;
                lasName.innerHTML = likeList[i].userInfo.nickname;
                img2.src = likeList[i].articleInfo.images[0];
            }
            toArticleorAuthor2();
        })
        .catch(function (error) {
            console.log(error);
        });
}
//评论和@页前往文章
function toArticleorAuthor2() {

    const lasContainer = document.querySelector('.raa-container');
    const lasItems = lasContainer.getElementsByClassName('raa-items');
    for (let i = 0; i < lasItems.length; i++) {
        lasItems[i].onclick = function () {
            console.log(1);
            const aid = this.getAttribute('data-articleId');
            nowArticleId = aid;
            bigContainer[5].style.display = 'none';
            articleShow.style = '';
            myMessage.style.display = 'none';
            bottomTab.style.display = 'none';
            loadArticleShow(aid);
            backControl = 2;
        }
    }
    const lasAvatar = lasContainer.getElementsByClassName('raa-avatar');
    for (let i = 0; i < lasAvatar.length; i++) {
        lasAvatar[i].addEventListener('click', function (e) {
            console.log(2);
            e.stopPropagation();
        })
    }
}
//评论和@页弹出
const returnToMessage = document.getElementById('return-to-message');
returnToMessage.onclick = function () {
    animate2(reviewAndAt, 100, function () {
        bigContainer[5].style.zIndex = '-1';
    })
    const lasItems = document.querySelectorAll('.raa-items');
    for (let i = lasItems.length - 1; i >= 0; i--) {
        lasItems[i].remove();
    }
}

//聊天页面弹入
const chatWindow = document.querySelector('.chat-window');
function loadChat() {
    const chatItems = document.querySelectorAll('.chat-items');
    const chatName = document.getElementById('chat-name');

    for (let i = 0; i < chatItems.length; i++) {
        chatItems[i].onclick = function () {
            sendControl = 0;
            receiverId = this.getAttribute('data-receiverId');
            chatWindow.style = '';
            myMessage.style.display = 'none';
            bottomTab.style.display = 'none';

            axios.get('http://175.178.193.182:8080/user/fullInfo?userId=' + receiverId)
                .then(function (response) {
                    console.log(response);
                    chatName.innerHTML = response.data.user.nickname;
                    receiverAvatar = response.data.user.avatar;
                })
                .catch(function (error) {
                    console.log(error);
                });

            axios.get('http://175.178.193.182:8080/chat/getRecord?userId=' + userId + '&receiverId=' + receiverId + '&page=1')
                .then(function (response) {
                    console.log(response);
                    const record = response.data.newRecord;
                    counter = record.length;
                    if (counter != 0) {
                        const chatPage = document.querySelector('.chat-page');
                        for (let i = 0; i < record.length; i++) {
                            const part = document.createElement('div');

                            chatPage.appendChild(part);
                            const chatAvatar = document.createElement('div');
                            chatAvatar.className = 'chat-avatar';
                            const chatRecord = document.createElement('div');
                            chatRecord.className = 'chat-record';
                            part.appendChild(chatAvatar);
                            part.appendChild(chatRecord);
                            const img = document.createElement('img');
                            chatAvatar.appendChild(img);
                            chatRecord.innerHTML = record[i].message;
                            if (record[i].userId == userId) {
                                part.className = 'my-part';
                                img.src = myAvatarSrc;
                            } else {
                                part.className = 'your-part';
                                img.src = receiverAvatar;
                            }
                        }
                    }
                    document.documentElement.scrollTop = document.documentElement.scrollHeight;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
}

//发送信息
const sendMessage = document.getElementById('send-message');
const clickToSend = document.getElementById('click-send');
sendMessage.oninput = function () {
    if (this.value == '') {
        clickToSend.style.display = 'none';
        this.style.width = '100%';
    } else {
        clickToSend.style = '';
        this.style.width = '85%';
    }
}
clickToSend.onclick = function () {
    const message = sendMessage.value;
    console.log(message);
    axios.post('http://175.178.193.182:8080/chat/send', {
        userId: userId,
        receiverId: receiverId,
        message: message
    })
        .then(function (response) {
            console.log(response);
            const chatPage = document.querySelector('.chat-page');
            const part = document.createElement('div');

            chatPage.appendChild(part);
            const chatAvatar = document.createElement('div');
            chatAvatar.className = 'chat-avatar';
            const chatRecord = document.createElement('div');
            chatRecord.className = 'chat-record';
            part.appendChild(chatAvatar);
            part.appendChild(chatRecord);
            const img = document.createElement('img');
            chatAvatar.appendChild(img);
            chatRecord.innerHTML = message;
            part.className = 'my-part';
            img.src = myAvatarSrc;
            socket.emit("send-message", {
                userId: String(userId),
                receiverId: String(receiverId),
                message: message
            });
            document.documentElement.scrollTop = document.documentElement.scrollHeight;
        })
        .catch(function (error) {
            console.log(error);
        });
    sendMessage.value = '';
    clickToSend.style.display = 'none';
    sendMessage.style.width = '100%';
}


//聊天页面弹出
const returnMessage = document.getElementById('return-message');
returnMessage.onclick = function () {
    const record = document.querySelector('.chat-page').childNodes;
    for (let i = record.length - 1; i >= 0; i--) {
        record[i].remove();
    }
    if (sendControl == 0) {
        chatWindow.style.display = 'none';
        myMessage.style = '';
        bottomTab.style = '';
    }
    else if (sendControl == 1) {
        chatWindow.style.display = 'none';
        myMessage.style = '';
        bottomTab.style = '';
        bigContainer[6].style.display = 'block';
    } else if (sendControl == 2) {
        chatWindow.style.display = 'none';
        otherPage.style.display = 'block';
    }
}

//选择人发私信 弹入
const createSend = document.getElementById('create-send');
const chooseSend = document.querySelector('.choose-send');
createSend.onclick = function () {
    console.log(1);
    bigContainer[6].style.display = 'block';
    animate1(chooseSend, 0);
    bigContainer[6].style.zIndex = '1';
    const cContainer = document.querySelector('.choose-container');
    axios.get('http://175.178.193.182:8080/user/fullInfo?userId=' + userId)
        .then(function (response) {
            console.log(response);
            const follows = response.data.user.follows;
            for (let i = 0; i < follows.length; i++) {
                axios.get('http://175.178.193.182:8080/user/fullInfo?userId=' + follows[i])
                    .then(function (response) {
                        console.log(response);
                        const hefollows = response.data.user.follows;
                        if (hefollows.indexOf(userId) != -1) {
                            const finding = response.data.user;
                            console.log(follows[i]);
                            const cBoxs = document.createElement('div');
                            cBoxs.className = 'choose-boxs';
                            cContainer.appendChild(cBoxs);
                            const cItems = document.createElement('div');
                            cItems.className = 'choose-items';
                            cBoxs.appendChild(cItems);
                            cItems.setAttribute('data-receiverid', finding.userId);
                            const avatar = document.createElement('div');
                            avatar.className = 'avatar';
                            const name = document.createElement('div');
                            name.className = 'name';
                            cItems.appendChild(avatar);
                            cItems.appendChild(name);
                            const img = document.createElement('img');
                            avatar.appendChild(img);
                            img.src = finding.avatar;
                            name.innerHTML = finding.nickname;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

//选择人发私信
const chooseContainer = document.querySelector('.choose-container');
chooseContainer.addEventListener('click', (e) => {
    if (e.target && e.target.getAttribute('data-receiverid')) {
        sendControl = 1;
        console.log(e.target.getAttribute('data-receiverid'));
        receiverId = e.target.getAttribute('data-receiverid');
        const chatName = document.getElementById('chat-name');
        let receiverAvatar = null;
        chatWindow.style = '';
        myMessage.style.display = 'none';
        bigContainer[6].style.display = 'none';
        bottomTab.style.display = 'none';

        axios.get('http://175.178.193.182:8080/user/fullInfo?userId=' + receiverId)
            .then(function (response) {
                console.log(response);
                chatName.innerHTML = response.data.user.nickname;
                receiverAvatar = response.data.user.avatar;
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://175.178.193.182:8080/chat/getRecord?userId=' + userId + '&receiverId=' + receiverId + '&page=1')
            .then(function (response) {
                console.log(response);
                const record = response.data.newRecord;
                const chatPage = document.querySelector('.chat-page');
                for (let i = 0; i < record.length; i++) {
                    const part = document.createElement('div');

                    chatPage.appendChild(part);
                    const chatAvatar = document.createElement('div');
                    chatAvatar.className = 'chat-avatar';
                    const chatRecord = document.createElement('div');
                    chatRecord.className = 'chat-record';
                    part.appendChild(chatAvatar);
                    part.appendChild(chatRecord);
                    const img = document.createElement('img');
                    chatAvatar.appendChild(img);
                    chatRecord.innerHTML = record[i].message;
                    if (record[i].userId == userId) {
                        part.className = 'my-part';
                        img.src = myAvatarSrc;
                    } else {
                        part.className = 'your-part';
                        img.src = receiverAvatar;
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
})

//选择人发私信 弹出
const returnBackMessage = document.getElementById('return-back-message');
returnBackMessage.onclick = function () {
    animate2(chooseSend, 100, function () {
        bigContainer[6].style.zIndex = '-1';
    })
    const chooseBoxs = document.querySelectorAll('.choose-boxs');
    for (let i = chooseBoxs.length - 1; i >= 0; i--) {
        chooseBoxs[i].remove();
    }
}

//我的文章点赞收藏
const personalNav = document.querySelector('.personal-nav');
const myPage = personalNav.querySelector('.article');
const myStars = personalNav.querySelector('.stars');
const myLikes = personalNav.querySelector('.likes');
myPage.onclick = function () {
    this.classList.add('personal-focus');
    myStars.classList.remove('personal-focus');
    myLikes.classList.remove('personal-focus');
    const myItems = document.querySelectorAll('.my-items');
    for (let i = myItems.length - 1; i >= 0; i--) {
        myItems[i].remove();
    }
    console.log(1);
    var objects = {
        url: 'http://175.178.193.182:8080/article/byAuthor',
        data: {
            authorId: userId
        },
        success: function (data, xhr) {
            console.log(data);
            mycolumnOne = 0;       //高度计数器
            mycolumnTwo = 0;
            mycolumn1 = 0;
            mycolumn2 = 0;

            const recommend = data.articles;

            for (let i = 0; i < recommend.length; i++) {
                // (function (i) {
                let count = 0;

                // console.log(columnOne);
                if (mycolumnOne > mycolumnTwo) {
                    count = 1;

                } else {
                    count = 0;
                }
                let mcontainer = document.querySelectorAll('.my-column')[count];
                let item = document.createElement('div');
                item.className = 'my-items';
                mcontainer.appendChild(item);
                let img1 = document.createElement('img');
                img1.className = 'picture';
                item.appendChild(img1);
                let h3 = document.createElement('h3');
                item.appendChild(h3);
                let avatar = document.createElement('div');
                avatar.className = 'avatar';
                item.appendChild(avatar);
                let img2 = document.createElement('img');
                img2.className = 'avatar1';
                avatar.appendChild(img2);
                let span1 = document.createElement('span');
                let span2 = document.createElement('span');
                let span3 = document.createElement('span');
                avatar.appendChild(span1);
                let good = document.createElement('div');
                good.className = 'good';
                avatar.appendChild(good);
                good.appendChild(span2);
                good.appendChild(span3);
                let putIn = mcontainer.querySelectorAll('.my-items')[count ? mycolumn2 : mycolumn1];
                let putimage = putIn.querySelector('.picture');
                let puth3 = putIn.querySelector('h3');
                let putavatar = putIn.querySelector('.avatar1');
                let putspan = putIn.querySelectorAll('span');
                putIn.setAttribute('data-articleId', recommend[i].articleId)
                putimage.src = recommend[i].images[0];
                puth3.innerHTML = recommend[i].title;

                var object = {
                    url: 'http://175.178.193.182:8080/user/fullInfo',
                    data: {
                        userId: userId
                    },
                    success: function (data, xhr) {
                        console.log(data);
                        putavatar.src = data.user.avatar;
                        putspan[0].innerHTML = data.user.nickname;
                    },
                    // 请求失败后的函数
                    error: function (data, xhr) {
                        console.log('这里是error函数' + data);
                        console.log(xhr);
                    }
                }
                ajax(object);


                putspan[1].className = 'iconfont';
                if (recommend[i].likerList.indexOf(userId) != -1) {
                    putspan[1].innerHTML = '&#xe613;';
                    putspan[1].style.color = 'red';

                } else {
                    putspan[1].innerHTML = '&#xe614;';
                }
                putspan[2].innerHTML = recommend[i].likes;

                let gaodu = putIn.offsetHeight;

                if (count == 0) {
                    mycolumnOne += gaodu;
                    mycolumn1++;
                } else {
                    mycolumnTwo += gaodu;
                    mycolumn2++;
                }
                console.log(mycolumnOne);
                console.log(mycolumnTwo);

            }
        },
        // 请求失败后的函数
        error: function (data, xhr) {
            console.log('这里是error函数' + data);
            console.log(xhr);
        }
    }
    ajax(objects);


}
myStars.onclick = function () {
    console.log(1);
    this.classList.add('personal-focus');
    myPage.classList.remove('personal-focus');
    myLikes.classList.remove('personal-focus');
    const myItems = document.querySelectorAll('.my-items');
    for (let i = myItems.length - 1; i >= 0; i--) {
        myItems[i].remove();
    }
    console.log(1);
    var objects = {
        url: 'http://175.178.193.182:8080/article/getStar',
        data: {
            userId: userId
        },
        success: function (data, xhr) {
            console.log(data);
            mycolumnOne = 0;       //高度计数器
            mycolumnTwo = 0;
            mycolumn1 = 0;
            mycolumn2 = 0;

            const recommend = data.staredArticles;

            for (let i = 0; i < recommend.length; i++) {
                // (function (i) {
                let count = 0;

                // console.log(columnOne);
                if (mycolumnOne > mycolumnTwo) {
                    count = 1;

                } else {
                    count = 0;
                }
                let mcontainer = document.querySelectorAll('.my-column')[count];
                let item = document.createElement('div');
                item.className = 'my-items';
                mcontainer.appendChild(item);
                let img1 = document.createElement('img');
                img1.className = 'picture';
                item.appendChild(img1);
                let h3 = document.createElement('h3');
                item.appendChild(h3);
                let avatar = document.createElement('div');
                avatar.className = 'avatar';
                item.appendChild(avatar);
                let img2 = document.createElement('img');
                img2.className = 'avatar1';
                avatar.appendChild(img2);
                let span1 = document.createElement('span');
                let span2 = document.createElement('span');
                let span3 = document.createElement('span');
                avatar.appendChild(span1);
                let good = document.createElement('div');
                good.className = 'good';
                avatar.appendChild(good);
                good.appendChild(span2);
                good.appendChild(span3);
                let putIn = mcontainer.querySelectorAll('.my-items')[count ? mycolumn2 : mycolumn1];
                let putimage = putIn.querySelector('.picture');
                let puth3 = putIn.querySelector('h3');
                let putavatar = putIn.querySelector('.avatar1');
                let putspan = putIn.querySelectorAll('span');
                putIn.setAttribute('data-articleId', recommend[i].articleId)
                putimage.src = recommend[i].images[0];
                puth3.innerHTML = recommend[i].title;

                var object = {
                    url: 'http://175.178.193.182:8080/user/fullInfo',
                    data: {
                        userId: recommend[i].authorId
                    },
                    success: function (data, xhr) {
                        console.log(data);
                        putavatar.src = data.user.avatar;
                        putspan[0].innerHTML = data.user.nickname;
                    },
                    // 请求失败后的函数
                    error: function (data, xhr) {
                        console.log('这里是error函数' + data);
                        console.log(xhr);
                    }
                }
                ajax(object);


                putspan[1].className = 'iconfont';
                if (recommend[i].likerList.indexOf(userId) != -1) {
                    putspan[1].innerHTML = '&#xe613;';
                    putspan[1].style.color = 'red';

                } else {
                    putspan[1].innerHTML = '&#xe614;';
                }
                putspan[2].innerHTML = recommend[i].likes;

                let gaodu = putIn.offsetHeight;

                if (count == 0) {
                    mycolumnOne += gaodu;
                    mycolumn1++;
                } else {
                    mycolumnTwo += gaodu;
                    mycolumn2++;
                }
                console.log(mycolumnOne);
                console.log(mycolumnTwo);

            }
        },
        // 请求失败后的函数
        error: function (data, xhr) {
            console.log('这里是error函数' + data);
            console.log(xhr);
        }
    }
    ajax(objects);
}
myLikes.onclick = function () {
    console.log(1);
    this.classList.add('personal-focus');
    myStars.classList.remove('personal-focus');
    myPage.classList.remove('personal-focus');
    const myItems = document.querySelectorAll('.my-items');
    for (let i = myItems.length - 1; i >= 0; i--) {
        myItems[i].remove();
    }
    console.log(1);
    var objects = {
        url: 'http://175.178.193.182:8080/article/getLike',
        data: {
            userId: userId
        },
        success: function (data, xhr) {
            console.log(data);
            mycolumnOne = 0;       //高度计数器
            mycolumnTwo = 0;
            mycolumn1 = 0;
            mycolumn2 = 0;

            const recommend = data.likedArticles;

            for (let i = 0; i < recommend.length; i++) {
                // (function (i) {
                let count = 0;

                // console.log(columnOne);
                if (mycolumnOne > mycolumnTwo) {
                    count = 1;

                } else {
                    count = 0;
                }
                let mcontainer = document.querySelectorAll('.my-column')[count];
                let item = document.createElement('div');
                item.className = 'my-items';
                mcontainer.appendChild(item);
                let img1 = document.createElement('img');
                img1.className = 'picture';
                item.appendChild(img1);
                let h3 = document.createElement('h3');
                item.appendChild(h3);
                let avatar = document.createElement('div');
                avatar.className = 'avatar';
                item.appendChild(avatar);
                let img2 = document.createElement('img');
                img2.className = 'avatar1';
                avatar.appendChild(img2);
                let span1 = document.createElement('span');
                let span2 = document.createElement('span');
                let span3 = document.createElement('span');
                avatar.appendChild(span1);
                let good = document.createElement('div');
                good.className = 'good';
                avatar.appendChild(good);
                good.appendChild(span2);
                good.appendChild(span3);
                let putIn = mcontainer.querySelectorAll('.my-items')[count ? mycolumn2 : mycolumn1];
                let putimage = putIn.querySelector('.picture');
                let puth3 = putIn.querySelector('h3');
                let putavatar = putIn.querySelector('.avatar1');
                let putspan = putIn.querySelectorAll('span');
                putIn.setAttribute('data-articleId', recommend[i].articleId)
                putimage.src = recommend[i].images[0];
                puth3.innerHTML = recommend[i].title;

                var object = {
                    url: 'http://175.178.193.182:8080/user/fullInfo',
                    data: {
                        userId: recommend[i].authorId
                    },
                    success: function (data, xhr) {
                        console.log(data);
                        putavatar.src = data.user.avatar;
                        putspan[0].innerHTML = data.user.nickname;
                    },
                    // 请求失败后的函数
                    error: function (data, xhr) {
                        console.log('这里是error函数' + data);
                        console.log(xhr);
                    }
                }
                ajax(object);


                putspan[1].className = 'iconfont';
                if (recommend[i].likerList.indexOf(userId) != -1) {
                    putspan[1].innerHTML = '&#xe613;';
                    putspan[1].style.color = 'red';

                } else {
                    putspan[1].innerHTML = '&#xe614;';
                }
                putspan[2].innerHTML = recommend[i].likes;

                let gaodu = putIn.offsetHeight;

                if (count == 0) {
                    mycolumnOne += gaodu;
                    mycolumn1++;
                } else {
                    mycolumnTwo += gaodu;
                    mycolumn2++;
                }
                console.log(mycolumnOne);
                console.log(mycolumnTwo);

            }
        },
        // 请求失败后的函数
        error: function (data, xhr) {
            console.log('这里是error函数' + data);
            console.log(xhr);
        }
    }
    ajax(objects);
}
//他人文章点赞收藏
const otherNav = document.querySelector('.other-nav');
const oPage = otherNav.querySelector('.o-article');
const oStars = otherNav.querySelector('.o-stars');
const oLikes = otherNav.querySelector('.o-likes');
oPage.onclick = function () {
    this.classList.add('personal-focus');
    oStars.classList.remove('personal-focus');
    oLikes.classList.remove('personal-focus');
    const myItems = document.querySelectorAll('.other-items');
    for (let i = myItems.length - 1; i >= 0; i--) {
        myItems[i].remove();
    }
    console.log(1);

    var objects = {
        url: 'http://175.178.193.182:8080/article/byAuthor',
        data: {
            authorId: othersId
        },
        success: function (data, xhr) {
            console.log(data);
            mycolumnOne = 0;       //高度计数器
            mycolumnTwo = 0;
            mycolumn1 = 0;
            mycolumn2 = 0;


            const recommend = data.articles;
            otherPostNum.innerHTML = recommend.length;

            for (let i = 0; i < recommend.length; i++) {
                // (function (i) {
                let count = 0;

                // console.log(columnOne);
                if (mycolumnOne > mycolumnTwo) {
                    count = 1;

                } else {
                    count = 0;
                }
                let mcontainer = document.querySelectorAll('.other-column')[count];
                let item = document.createElement('div');
                item.className = 'other-items';
                mcontainer.appendChild(item);
                let img1 = document.createElement('img');
                img1.className = 'picture';
                item.appendChild(img1);
                let h3 = document.createElement('h3');
                item.appendChild(h3);
                let avatar = document.createElement('div');
                avatar.className = 'avatar';
                item.appendChild(avatar);
                let img2 = document.createElement('img');
                img2.className = 'avatar1';
                avatar.appendChild(img2);
                let span1 = document.createElement('span');
                let span2 = document.createElement('span');
                let span3 = document.createElement('span');
                avatar.appendChild(span1);
                let good = document.createElement('div');
                good.className = 'good';
                avatar.appendChild(good);
                good.appendChild(span2);
                good.appendChild(span3);
                let putIn = mcontainer.querySelectorAll('.other-items')[count ? mycolumn2 : mycolumn1];
                let putimage = putIn.querySelector('.picture');
                let puth3 = putIn.querySelector('h3');
                let putavatar = putIn.querySelector('.avatar1');
                let putspan = putIn.querySelectorAll('span');
                putIn.setAttribute('data-articleId', recommend[i].articleId)
                putimage.src = recommend[i].images[0];
                puth3.innerHTML = recommend[i].title;

                var object = {
                    url: 'http://175.178.193.182:8080/user/fullInfo',
                    data: {
                        userId: othersId
                    },
                    success: function (data, xhr) {
                        console.log(data);
                        putavatar.src = data.user.avatar;
                        putspan[0].innerHTML = data.user.nickname;
                    },
                    // 请求失败后的函数
                    error: function (data, xhr) {
                        console.log('这里是error函数' + data);
                        console.log(xhr);
                    }
                }
                ajax(object);


                putspan[1].className = 'iconfont';
                if (recommend[i].likerList.indexOf(userId) != -1) {
                    putspan[1].innerHTML = '&#xe613;';
                    putspan[1].style.color = 'red';

                } else {
                    putspan[1].innerHTML = '&#xe614;';
                }
                putspan[2].innerHTML = recommend[i].likes;

                let gaodu = putIn.offsetHeight;

                if (count == 0) {
                    mycolumnOne += gaodu;
                    mycolumn1++;
                } else {
                    mycolumnTwo += gaodu;
                    mycolumn2++;
                }
                console.log(mycolumnOne);
                console.log(mycolumnTwo);

            }
        },
        // 请求失败后的函数
        error: function (data, xhr) {
            console.log('这里是error函数' + data);
            console.log(xhr);
        }
    }
    ajax(objects);


}
oStars.onclick = function () {
    console.log(1);
    this.classList.add('personal-focus');
    oPage.classList.remove('personal-focus');
    oLikes.classList.remove('personal-focus');
    const myItems = document.querySelectorAll('.other-items');
    for (let i = myItems.length - 1; i >= 0; i--) {
        myItems[i].remove();
    }
    console.log(1);
    var objects = {
        url: 'http://175.178.193.182:8080/article/getStar',
        data: {
            userId: othersId
        },
        success: function (data, xhr) {
            console.log(data);
            mycolumnOne = 0;       //高度计数器
            mycolumnTwo = 0;
            mycolumn1 = 0;
            mycolumn2 = 0;

            const recommend = data.staredArticles;

            for (let i = 0; i < recommend.length; i++) {
                // (function (i) {
                let count = 0;

                // console.log(columnOne);
                if (mycolumnOne > mycolumnTwo) {
                    count = 1;

                } else {
                    count = 0;
                }
                let mcontainer = document.querySelectorAll('.other-column')[count];
                let item = document.createElement('div');
                item.className = 'other-items';
                mcontainer.appendChild(item);
                let img1 = document.createElement('img');
                img1.className = 'picture';
                item.appendChild(img1);
                let h3 = document.createElement('h3');
                item.appendChild(h3);
                let avatar = document.createElement('div');
                avatar.className = 'avatar';
                item.appendChild(avatar);
                let img2 = document.createElement('img');
                img2.className = 'avatar1';
                avatar.appendChild(img2);
                let span1 = document.createElement('span');
                let span2 = document.createElement('span');
                let span3 = document.createElement('span');
                avatar.appendChild(span1);
                let good = document.createElement('div');
                good.className = 'good';
                avatar.appendChild(good);
                good.appendChild(span2);
                good.appendChild(span3);
                let putIn = mcontainer.querySelectorAll('.other-items')[count ? mycolumn2 : mycolumn1];
                let putimage = putIn.querySelector('.picture');
                let puth3 = putIn.querySelector('h3');
                let putavatar = putIn.querySelector('.avatar1');
                let putspan = putIn.querySelectorAll('span');
                putIn.setAttribute('data-articleId', recommend[i].articleId)
                putimage.src = recommend[i].images[0];
                puth3.innerHTML = recommend[i].title;

                var object = {
                    url: 'http://175.178.193.182:8080/user/fullInfo',
                    data: {
                        userId: recommend[i].authorId
                    },
                    success: function (data, xhr) {
                        console.log(data);
                        putavatar.src = data.user.avatar;
                        putspan[0].innerHTML = data.user.nickname;
                    },
                    // 请求失败后的函数
                    error: function (data, xhr) {
                        console.log('这里是error函数' + data);
                        console.log(xhr);
                    }
                }
                ajax(object);


                putspan[1].className = 'iconfont';
                if (recommend[i].likerList.indexOf(userId) != -1) {
                    putspan[1].innerHTML = '&#xe613;';
                    putspan[1].style.color = 'red';

                } else {
                    putspan[1].innerHTML = '&#xe614;';
                }
                putspan[2].innerHTML = recommend[i].likes;

                let gaodu = putIn.offsetHeight;

                if (count == 0) {
                    mycolumnOne += gaodu;
                    mycolumn1++;
                } else {
                    mycolumnTwo += gaodu;
                    mycolumn2++;
                }
                console.log(mycolumnOne);
                console.log(mycolumnTwo);

            }
        },
        // 请求失败后的函数
        error: function (data, xhr) {
            console.log('这里是error函数' + data);
            console.log(xhr);
        }
    }
    ajax(objects);
}
oLikes.onclick = function () {
    console.log(1);
    this.classList.add('personal-focus');
    oStars.classList.remove('personal-focus');
    oPage.classList.remove('personal-focus');
    const myItems = document.querySelectorAll('.other-items');
    for (let i = myItems.length - 1; i >= 0; i--) {
        myItems[i].remove();
    }
    console.log(1);
    var objects = {
        url: 'http://175.178.193.182:8080/article/getLike',
        data: {
            userId: othersId
        },
        success: function (data, xhr) {
            console.log(data);
            mycolumnOne = 0;       //高度计数器
            mycolumnTwo = 0;
            mycolumn1 = 0;
            mycolumn2 = 0;

            const recommend = data.likedArticles;

            for (let i = 0; i < recommend.length; i++) {
                // (function (i) {
                let count = 0;

                // console.log(columnOne);
                if (mycolumnOne > mycolumnTwo) {
                    count = 1;

                } else {
                    count = 0;
                }
                let mcontainer = document.querySelectorAll('.other-column')[count];
                let item = document.createElement('div');
                item.className = 'other-items';
                mcontainer.appendChild(item);
                let img1 = document.createElement('img');
                img1.className = 'picture';
                item.appendChild(img1);
                let h3 = document.createElement('h3');
                item.appendChild(h3);
                let avatar = document.createElement('div');
                avatar.className = 'avatar';
                item.appendChild(avatar);
                let img2 = document.createElement('img');
                img2.className = 'avatar1';
                avatar.appendChild(img2);
                let span1 = document.createElement('span');
                let span2 = document.createElement('span');
                let span3 = document.createElement('span');
                avatar.appendChild(span1);
                let good = document.createElement('div');
                good.className = 'good';
                avatar.appendChild(good);
                good.appendChild(span2);
                good.appendChild(span3);
                let putIn = mcontainer.querySelectorAll('.other-items')[count ? mycolumn2 : mycolumn1];
                let putimage = putIn.querySelector('.picture');
                let puth3 = putIn.querySelector('h3');
                let putavatar = putIn.querySelector('.avatar1');
                let putspan = putIn.querySelectorAll('span');
                putIn.setAttribute('data-articleId', recommend[i].articleId)
                putimage.src = recommend[i].images[0];
                puth3.innerHTML = recommend[i].title;

                var object = {
                    url: 'http://175.178.193.182:8080/user/fullInfo',
                    data: {
                        userId: recommend[i].authorId
                    },
                    success: function (data, xhr) {
                        console.log(data);
                        putavatar.src = data.user.avatar;
                        putspan[0].innerHTML = data.user.nickname;
                    },
                    // 请求失败后的函数
                    error: function (data, xhr) {
                        console.log('这里是error函数' + data);
                        console.log(xhr);
                    }
                }
                ajax(object);


                putspan[1].className = 'iconfont';
                if (recommend[i].likerList.indexOf(userId) != -1) {
                    putspan[1].innerHTML = '&#xe613;';
                    putspan[1].style.color = 'red';

                } else {
                    putspan[1].innerHTML = '&#xe614;';
                }
                putspan[2].innerHTML = recommend[i].likes;

                let gaodu = putIn.offsetHeight;

                if (count == 0) {
                    mycolumnOne += gaodu;
                    mycolumn1++;
                } else {
                    mycolumnTwo += gaodu;
                    mycolumn2++;
                }
                console.log(mycolumnOne);
                console.log(mycolumnTwo);

            }
        },
        // 请求失败后的函数
        error: function (data, xhr) {
            console.log('这里是error函数' + data);
            console.log(xhr);
        }
    }
    ajax(objects);
}

//点击他人关注和粉丝（无法查看）
const otherFollows = document.querySelector('.o-follows');
const otherFans = document.querySelector('.o-fans');
const clickTips = document.querySelector('.click-tips');
const clickTipSend = document.querySelector('.click-tipsend');
otherFollows.onclick = function () {
    clickTips.style = '';
    setTimeout(() => {
        clickTips.style.display = 'none';
    }, 1000);
}
otherFans.onclick = function () {
    clickTips.style = '';
    setTimeout(() => {
        clickTips.style.display = 'none';
    }, 1000);
}

//点击显示他人文章点赞收藏
const otherDataShow = document.querySelector('.o-likes-stars');
const otherShowPage = document.querySelector('.o-mask');
const clickIKnow = document.querySelector('.i-know');
const otherPostNum = document.querySelector('.o-post-num');
const otherlikeNum = document.querySelector('.o-like-num');
const otherstarNum = document.querySelector('.o-star-num');
otherDataShow.onclick = function () {
    console.log(1);
    otherShowPage.style = '';
    var objects = {
        url: 'http://175.178.193.182:8080/user/fullInfo',
        data: {
            userId: othersId
        },
        success: function (data, xhr) {
            console.log('这里是success函数');
            let user = data.user;
            otherlikeNum.innerHTML = user.likedArticles.length;
            otherstarNum.innerHTML = user.staredArticles.length
        },
        // 请求失败后的函数
        error: function (data, xhr) {
            console.log('这里是error函数' + data);
            console.log(xhr);
        }
    }
    ajax(objects);
}

//点击我知道了返回
clickIKnow.onclick = function () {
    otherShowPage.style.display = 'none';
}

var nowpages = 1;
var lastpages = 0;
var nowReviewPages = 1;
//登出
logout.onclick = function () {
    // console.log('test');
    const xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.open('POST', 'http://175.178.193.182:8080/logout');

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send("userId=" + userId);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {

                console.log(xhr.response);

                bottomTab.style.display = 'none';
                loginPage.style = '';

                mainpage.className = 'focus';
                mainPage.style.display = 'none';

                mymessage.className = '';
                myMessage.style.display = 'none';

                personalcenter.className = '';
                personalCenter.style.display = 'none';
                //清除聊天列表
                const chatItems = document.querySelectorAll('.chat-items');
                for (let i = chatItems.length - 1; i >= 0; i--) {
                    chatItems[i].remove();
                }
                //清除文章列表
                const mItems = document.querySelectorAll('.m-items');
                for (let i = mItems.length - 1; i >= 0; i--) {
                    mItems[i].remove();
                }
                nowpages = 1;
                lastpages = 0;
                columnOne = 0;       //高度计数器
                columnTwo = 0;
                column1 = 0;
                column2 = 0;
            } else {

            }
        }
    }
}

for (let i = 0; i < eMessage.length; i++) {
    eMessage[i].ontouchstart = function () {
        this.style.backgroundColor = '#ddd';
    }
    eMessage[i].ontouchend = function () {
        this.style.backgroundColor = '';
    }
}

const mainArticle = document.querySelector('.main-article');
window.addEventListener('scroll', throttle(loadMore));

window.addEventListener('beforeunload', function () {
    logout.click();
})

function throttle(fn) {
    let canRun = true; // 通过闭包保存一个标记
    return function () {
        // 在函数开头判断标记是否为true，不为true则return
        if (!canRun) return;
        // 立即设置为false
        canRun = false;
        // 将外部传入的函数的执行放在setTimeout中
        setTimeout(() => {
            // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。
            // 当定时器没有执行的时候标记永远是false，在开头被return掉
            fn.apply(this, arguments);
            canRun = true;
        }, 800);
    };
}

function loadMore() {
    if (mainPage.style.display != 'none' && document.documentElement.scrollTop) {
        if (document.documentElement.clientHeight + document.documentElement.scrollTop >= window.document.documentElement.scrollHeight - 1) {
            console.log('加载数据');
            if (nowpages != lastpages) {
                axios.get('http://175.178.193.182:8080/article/getHomePageTag?tag=' + loadArticleType + '&pages=' + nowpages)
                    .then(function (response) {

                        console.log(response);
                        const recommend = response.data.articles;

                        for (let i = 0; i < recommend.length; i++) {
                            // (function (i) {
                            let count = 0;

                            // console.log(columnOne);
                            if (columnOne > columnTwo) {
                                count = 1;

                            } else {
                                count = 0;
                            }
                            let mcontainer = document.querySelectorAll('.m-column')[count];
                            addBox(mcontainer);
                            let putIn = mcontainer.querySelectorAll('.m-items')[count ? column2 : column1];
                            let putimage = putIn.querySelector('.picture');
                            let puth3 = putIn.querySelector('h3');
                            let putavatar = putIn.querySelector('.avatar1');
                            let putspan = putIn.querySelectorAll('span');
                            putIn.setAttribute('data-articleId', recommend[i].articleId)
                            putimage.src = recommend[i].images[0];
                            puth3.innerHTML = recommend[i].title;
                            putavatar.src = recommend[i].avatar;
                            putspan[0].innerHTML = recommend[i].authorName;
                            putspan[1].className = 'iconfont';
                            if (recommend[i].likerList.indexOf(userId) != -1) {
                                putspan[1].innerHTML = '&#xe613;';
                                putspan[1].style.color = 'red';

                            } else {
                                putspan[1].innerHTML = '&#xe614;';
                            }
                            putspan[2].innerHTML = recommend[i].likes;
                            // console.log(putimage.offsetHeight);

                            // while(!putimage.complete){
                            // delay(1);
                            // }
                            let gaodu = putIn.offsetHeight;
                            // console.log(gaodu);
                            if (count == 0) {
                                columnOne += gaodu;
                                column1++;
                            } else {
                                columnTwo += gaodu;
                                column2++;
                            }
                            console.log(columnOne);
                            console.log(columnTwo);
                            //}(i))

                        }
                        nowpages++;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            lastpages++;
        }
    } else if (articleShow.style.display == 'block') {
        if (document.documentElement.clientHeight + document.documentElement.scrollTop >= this.document.documentElement.scrollHeight - 1) {
            console.log('加载评论');
            axios.get('http://175.178.193.182:8080/review/byArticle?articleId=' + nowArticleId + '&pages=' + nowReviewPages)
                .then(function (response) {
                    console.log(response);
                    const reviews = response.data.reviews;
                    const container = articleShow.querySelector('.comments-container');
                    for (let i = 0; i < reviews.length; i++) {
                        const cItems = document.createElement('div');
                        cItems.className = 'comments-items';
                        container.appendChild(cItems);

                        const parentRow = document.createElement('div');
                        parentRow.className = 'parent-row';
                        cItems.appendChild(parentRow);
                        const avatar = document.createElement('div');
                        avatar.className = 'avatar';
                        const mainBox = document.createElement('div');
                        mainBox.className = 'main-box';

                        mainBox.setAttribute('data-authorId', reviews[i].authorId);
                        mainBox.setAttribute('data-reviewId', reviews[i].reviewId);

                        const smallBox = document.createElement('div');
                        smallBox.className = 'small-box';

                        const iconFont = document.createElement('i');
                        iconFont.className = 'iconfont';

                        const reviewLike = document.createElement('div');
                        reviewLike.className = 'review-like';

                        parentRow.appendChild(avatar);
                        parentRow.appendChild(mainBox);
                        parentRow.appendChild(smallBox);
                        smallBox.appendChild(iconFont);
                        smallBox.appendChild(reviewLike);

                        const img1 = document.createElement('img');  //一级评论头像
                        avatar.appendChild(img1);
                        const reviewName = document.createElement('div');
                        reviewName.className = 'name';
                        const reviewContact = document.createElement('div');
                        reviewContact.className = 'review-contact';
                        const reviewDate = document.createElement('div');
                        reviewDate.className = 'review-date';
                        mainBox.appendChild(reviewName);
                        mainBox.appendChild(reviewContact);
                        mainBox.appendChild(reviewDate);

                        if (reviews[i].authorId == userId) {
                            const delateReview = document.createElement('div');
                            delateReview.className = 'delate-review';
                            mainBox.appendChild(delateReview);
                            delateReview.innerHTML = '删除';
                            delateReview.setAttribute('data-reviewid', reviews[i].reviewId);
                            delateReview.addEventListener('click', (e) => {
                                e.stopPropagation();
                                console.log(parseInt(e.target.getAttribute('data-reviewId')));
                                axios.post('http://175.178.193.182:8080/review/delete', {
                                    reviewId: e.target.getAttribute('data-reviewId')
                                })
                                    .then(function (response) {
                                        console.log(response);
                                        e.target.parentNode.parentNode.parentNode.remove();
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            })
                        }

                        reviewContact.innerHTML = reviews[i].content;
                        reviewDate.innerHTML = reviews[i].postDate.substring(5, 10);
                        reviewLike.innerHTML = reviews[i].likerList.length;
                        if (reviews[i].likerList.indexOf(userId) != -1) {
                            iconFont.innerHTML = '&#xe613;';
                            iconFont.style.color = 'red';
                        } else {
                            iconFont.innerHTML = '&#xe614;';
                        }

                        reviewLike.setAttribute('data-reviewId', reviews[i].reviewId);
                        smallBox.setAttribute('data-reviewId', reviews[i].reviewId);
                        //个人评论头像加载

                        axios.get('http://175.178.193.182:8080/user/baseInfo?userId=' + reviews[i].authorId)
                            .then(function (response) {

                                console.log(response);
                                const user = response.data.user;
                                img1.src = user.avatar;
                                img1.setAttribute('data-reviewerid', user.userId);
                                reviewName.innerHTML = user.nickname;
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        //判断是否有二级评论并添加
                        if (reviews[i].reviewList.length > 0) {
                            for (let j = 0; j < reviews[i].reviewList.length; j++) {
                                const sonRow = document.createElement('div');
                                sonRow.className = 'son-row';
                                cItems.appendChild(sonRow);
                                const white = document.createElement('div');
                                white.className = 'white';
                                const mainSonbox = document.createElement('div');
                                mainSonbox.className = 'main-sonbox';
                                const smallBox = document.createElement('div');
                                smallBox.className = 'small-box';

                                const sonIcon = document.createElement('i');
                                sonIcon.className = 'iconfont';

                                const sonLike = document.createElement('div');
                                sonLike.className = 'review-like';
                                sonRow.appendChild(white);
                                sonRow.appendChild(mainSonbox);
                                sonRow.appendChild(smallBox);
                                smallBox.appendChild(sonIcon);
                                smallBox.appendChild(sonLike);
                                const sonAvatar = document.createElement('div');
                                sonAvatar.className = 'son-avatar';
                                const img2 = document.createElement('img');
                                mainSonbox.appendChild(sonAvatar);
                                sonAvatar.appendChild(img2);
                                const sonBox = document.createElement('div');
                                sonBox.className = 'son-box';
                                mainSonbox.appendChild(sonBox);
                                const sonName = document.createElement('div');
                                const sonContact = document.createElement('div');
                                sonName.className = 'son-name';
                                sonContact.className = 'son-contact';
                                sonBox.appendChild(sonName);
                                sonBox.appendChild(sonContact);
                                const spanDate = reviews[i].reviewList[j].postDate.substring(5, 10);

                                if (reviews[i].reviewList[j].authorId == userId) {
                                    const delateReview = document.createElement('div');
                                    delateReview.className = 'delate-review';
                                    sonBox.appendChild(delateReview);
                                    delateReview.innerHTML = '删除';
                                    delateReview.setAttribute('data-reviewid', reviews[i].reviewList[j].reviewId);
                                    delateReview.addEventListener('click', (e) => {
                                        e.stopPropagation();
                                        console.log(parseInt(e.target.getAttribute('data-reviewId')));
                                        axios.post('http://175.178.193.182:8080/review/delete', {
                                            reviewId: e.target.getAttribute('data-reviewId')
                                        })
                                            .then(function (response) {
                                                console.log(response);
                                                e.target.parentNode.parentNode.parentNode.remove();
                                            })
                                            .catch(function (error) {
                                                console.log(error);
                                            });
                                    })
                                }

                                sonContact.innerHTML = reviews[i].reviewList[j].content + ' <span>' + spanDate + '</span>';
                                sonLike.innerHTML = reviews[i].reviewList[j].likerList.length;
                                if (reviews[i].reviewList[j].likerList.indexOf(userId) != -1) {
                                    sonIcon.innerHTML = '&#xe613;';
                                    sonIcon.style.color = 'red';
                                } else {
                                    sonIcon.innerHTML = '&#xe614;';
                                }
                                sonLike.setAttribute('data-reviewId', reviews[i].reviewList[j].reviewId);
                                smallBox.setAttribute('data-reviewId', reviews[i].reviewList[j].reviewId);
                                axios.get('http://175.178.193.182:8080/user/baseInfo?userId=' + reviews[i].reviewList[j].authorId)
                                    .then(function (response) {

                                        console.log(response);

                                        img2.src = response.data.user.avatar;
                                        img2.setAttribute('data-reviewerid', response.data.user.userId);
                                        sonName.innerHTML = response.data.user.nickname;
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            }
                        }

                    }
                    replyTo();
                    nowReviewPages++;
                })
                .catch(function (error) {
                    console.log(error);
                });

        }
    }
}