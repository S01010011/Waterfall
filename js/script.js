/*
// 原生JS实现
window.onload = function(){
	// 模拟后端返回的json数据
	var data = {
		"data":[
			{"src":"1.png"},
			{"src":"2.png"},
			{"src":"3.png"},
			{"src":"4.png"},
			{"src":"5.png"},
			{"src":"6.png"},
			{"src":"7.png"},
			{"src":"8.png"},
			{"src":"9.png"},
			{"src":"10.png"},
			{"src":"11.png"},
			{"src":"12.png"},
			{"src":"13.png"},
			{"src":"14.png"},
			{"src":"15.png"},
			{"src":"16.png"},
			{"src":"17.png"},
			{"src":"18.png"},
			{"src":"19.png"},
		]
	}

	waterfall();

	// 通过onscroll判断是否允许开始加载新的box，新的box的内容由后端返回
	window.onscroll = function(){
		if(checkLoad()){
			var main = document.getElementById('main');

			// 添加新的内容加载到页面中
			for(var i in data.data){
				var box = document.createElement('div');
				box.className = 'box';
				main.appendChild(box);

				var pic = document.createElement('div');
				pic.className = 'pic';
				box.appendChild(pic);

				var img = document.createElement('img');
				img.setAttribute("src","img/"+data.data[i].src);
				pic.appendChild(img);
			}

			waterfall();
		}
	}

	window.onresize = waterfall;

}

function waterfall(){
	var main = document.getElementById('main'),
		boxs = document.getElementsByClassName('box');

	// 计算当前页面显示的列数（页面宽度 ÷ box的宽度）
	var boxW = boxs[0].offsetWidth,
		cols = Math.floor(document.documentElement.clientWidth / boxW),
		hArr = [];	// 用于存放盒子高度数值的数组

	main.style.cssText = "width:"+ Number(boxW*cols+10) +"px; margin:0 auto";

	for(var i=0;i<boxs.length;i++){
		boxs[i].style="";

		if(i<cols)
			hArr.push(boxs[i].offsetHeight);
		else{
			// 找出当前列高数组中，最小高度的那个位置，然后把下一个box插入到那个位置，然后更新列高数组
			var minH = Math.min.apply(null,hArr),
				minIndex = hArr.indexOf(minH);

			boxs[i].style.position = "absolute";
			boxs[i].style.top = minH +"px";
			boxs[i].style.left = boxs[minIndex].offsetLeft +"px";

			hArr[minIndex] += boxs[i].offsetHeight;
		}
	}
}

function checkLoad(){
	var main = document.getElementById('main'),
		boxs = document.getElementsByClassName('box');

	// 判断当最后一个box已经显示超过一半时开始加载下一组box
	// 通过判断不断增大的scrollTop的值来确定是否超过一半
	var lastBoxH = boxs[boxs.length-1].offsetTop + Math.floor(boxs[boxs.length-1].offsetHeight/2),
		top = document.body.scrollTop || document.documentElement.scrollTop,
		height = document.body.clientHeight || document.documentElement.clientHeight;

	return lastBoxH<top+height;
} */

// jQuery实现 + 分散动画效果
$(window).on('load',function(){

	// loading...
	$('#preloader').stop(true).fadeOut(1000);

	//初始化scrollreveal
	// window.sr = new ScrollReveal();

	// 模拟后端返回的json数据
	var data = {
		"data":[
			{"src":"1.png"},
			{"src":"2.png"},
			{"src":"3.png"},
			{"src":"4.png"},
			{"src":"5.png"},
			{"src":"6.png"},
			{"src":"7.png"},
			{"src":"8.png"},
			{"src":"9.png"},
			{"src":"10.png"},
			{"src":"11.png"},
			{"src":"12.png"},
			{"src":"13.png"},
			{"src":"14.png"},
			{"src":"15.png"},
			{"src":"16.png"},
			{"src":"17.png"},
			{"src":"18.png"},
			{"src":"19.png"},
		]
	}

	waterfall(true);

	// 通过onscroll判断是否允许开始加载新的box，新的box的内容由后端返回
	$(window).scroll(function(){
		if(checkLoad()){
			var $main = $('#main'),
				boxs = new Array();

			// 添加新的内容加载到页面中
			$(data.data).each(function(index,elem){
				//console.log(index+','+$(elem).attr('src')+','+$(this).attr('src'));
				var $box = $("<div>").addClass('box').appendTo($main),
					$pic = $("<div class='pic'></div>").appendTo($box),
					$img = $("<img>").attr('src',"img/"+$(this).attr('src')).appendTo($pic);

				addBox($box,$box.outerWidth());
				boxs.push($box);
				
				$box.waypoint(function(dir){
					$box.addClass('animated fadeInUp')
				},{
					offset:'90%'
				});

			});

			// sr.reveal(boxs,{distance:'80px',duration:800},100);

		}
	});

	$(window).resize(function(){waterfall(false)});
});

var hArr = [];	// 用于存放盒子高度数值的数组
function waterfall(first){
	var $main = $('#main'),
		$boxs = $main.children('.box');

	// 计算当前页面显示的列数（页面宽度 ÷ box的宽度）
	var boxW = $boxs.eq(0).outerWidth(),
		cols = Math.floor($(window).width() / boxW);

	$main.css({
		"width": Number(boxW*cols),
		"margin": "0 auto",
	});

	if(first){
		// 使图片分散随机出现在屏幕中间
		$boxs.each(function(){
			$(this).css({
				'position':'absolute',
				'top':($(window).height()/2-$(this).outerHeight()/2)
						+((Math.floor(Math.random()*10)<5?-1:1)*Math.floor(Math.random()*200)),
				'left':($(window).width()/2-$(this).outerWidth()/2)
						+((Math.floor(Math.random()*10)<5?-1:1)*Math.floor(Math.random()*350)),
			});
		});

		// 动画效果
		setTimeout(function(){
			$boxs.each(function(index){
				if(index<cols){
					hArr.push($(this).outerHeight());
					$(this).animate({
						'top':0,
						'left':index*boxW,
					},1000);
				}
				else{
					var minH = Math.min.apply(null,hArr),
						minIndex = $.inArray(minH,hArr);

					$(this).animate({
						"top":minH,
						"left":minIndex*boxW,
					},1000,function(){
						$('body').css('overflow','visible'); //启用滚动条
						$(window).trigger('scroll');
					});

					hArr[minIndex] += $(this).outerHeight();
				}
			});
		},1000);
	}
	else{
		hArr = [];
		$boxs.each(function(index){
			$(this).attr("style","");

			if(index<cols)
				hArr.push($(this).outerHeight());
			else{
				var minH = Math.min.apply(null,hArr),
					minIndex = $.inArray(minH,hArr);
				$(this).css({
					"position":"absolute",
					"top":minH,
					"left":minIndex*boxW,
				});
				hArr[minIndex] += $(this).outerHeight();
			}
		});
	}
}

function addBox(elem,boxW){
	// 找出当前列高数组中，最小高度的那个位置，
	// 然后把下一个box插入到那个位置，然后更新列高数组
	var minH = Math.min.apply(null,hArr),
		minIndex = $.inArray(minH,hArr);

	$(elem).css({
		"position":"absolute",
		"opacity":0,
		"top":minH,
		"left":minIndex*boxW,
	});

	hArr[minIndex] += $(elem).outerHeight();

	// $(elem).animate({
	// 	"opacity":1,
	// 	'top':minH
	// },700);
	
}

var flag = true;
function checkLoad(){

	if($('body').css('overflow') != 'visible')
		return false;

	var $lastBox = $('#main>.box').last();
	// 判断当最后一个box已经显示超过一半时开始加载下一组box
	// 通过判断不断增大的scrollTop的值来确定是否超过一半
	var lastBoxH = $lastBox.offset().top + Math.floor($lastBox.outerHeight()/2),
		top = $(window).scrollTop(),
		height = $(window).height(),
		$boxs = $('#main>.box');

	if($boxs.length>300){
		if(flag){
			alert("已超出300张图片，停止加载图片");
			flag = false;
		}
		return false;
	}
	else
		return lastBoxH<top+height;
}
