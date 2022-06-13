$(function(){

  //-- News --
  //一覧表示箇所の取得
  const news_list_disp = $('#news-list');
  if(news_list_disp){
    $.ajax({
      url: 'https://novo.microcms.io/api/v1/news',
      type: 'GET',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'X-MICROCMS-API-KEY': 'cf7c36b981ee486faca318a945613392a2e1'
      },
    })
    .done(function(data) {
      let lines = '';
      //記事ループ数
      let contents_count = 0;

      // 各値の取得
      $.each(data.contents, function(index, value) {

        let date = value.publishedAt.slice(0,10).replace(/-/g, '/');
        let title = value.title ? value.title : "";
        let id = value.id;

        //ページ：Top、記事一覧
        // 記事一覧のHTMLを生成
        if(news_list_disp){
          if(news_list_disp.hasClass("is-top") && contents_count > 2){
            //3件目以降は非表示(Topページのみ)
          }else{
            lines +=  '<li class="item">\
            <a href="/news/article?id='+ id +'">\
            <p class="date">'+ date +'</p>\
            <p class="title">'+ title +'</p>\
            </a></li>';
          }
        }
        contents_count += 1;
      })
      news_list_disp.html(lines);
    })
    .fail(function() {
      console.log('failed');
    });
  }

  //-- Article --
  if(location.pathname.indexOf("/article") >= 0){
    $.ajax({
      url: 'https://novo.microcms.io/api/v1/news',
      type: 'GET',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'X-MICROCMS-API-KEY': 'cf7c36b981ee486faca318a945613392a2e1'
      },
    })
    .done(function(data) {
      let article = '';
      //記事生成フラグ
      let generated_article_flg = false;

      // 各値の取得
        console.log(data)
      $.each(data.contents, function(index, value) {

        let date = value.publishedAt.slice(0,10).replace(/-/g, '/');
        let title = value.title ? value.title : "";
        let body = value.body ? value.body : "";
        let image = value.image01 ? value.image01.url : "";
        let id = value.id;

        //個別記事のHTMLを生成
        let article_id = location.search.slice(4,20);

        //ページ：記事詳細
        if(id === article_id 
          &&
          location.pathname.indexOf("/article") >= 0){
          $('#article-title').text(title);

          article =  '<div class="card column is-12">\
            <div class="card-image"><img src="'+ image +'" alt="image" width="100%"></div>\
            <div class="card-content"><div class="content">\
            <h3 class="title is-2">'+ title +'</h3>\
            <time datetime="'+ date +'">'+ date +'</time>\
            <p>'+ body +'</p>\
            </div></div>\
            </div>';
          $('#article-content').html(article);

          generated_article_flg = true;
        }
      })

      //記事の生成に失敗した場合
      if(!generated_article_flg){
        $('#article-content').html("<p>記事を取得出来ませんでした。</p>");
        setTimeout(function () {
          window.location.href = '/news';
        }, 3000);
      }
    })
    .fail(function() {
      console.log('failed');
      $('#article-content').html("<p>記事を取得出来ませんでした。</p>");
      setTimeout(function () {
        window.location.href = '/news';
      }, 3000);
    });
  }

  //-- 制作実績(Website,EC) --
  if(location.pathname.indexOf("/website") >= 0
    ||
    location.pathname.indexOf("/ec") >= 0){
    let end_point = "";
    //エンドポイント設定
    if(location.pathname.indexOf("/website") >= 0){
      end_point = "works-hp"
    }else if(location.pathname.indexOf("/ec") >= 0){
      end_point = "works-ec"
    }

    $.ajax({
      url: `https://novo.microcms.io/api/v1/${end_point}`,
      type: 'GET',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'X-MICROCMS-API-KEY': 'cf7c36b981ee486faca318a945613392a2e1'
      },
    })
    .done(function(data) {
      let lines = '';
  
      //一覧表示位置
      const hp_works_disp = $('#works-contents');
  
      // 各値の取得
      $.each(data.contents, function(index, value) {
        let title = value.title;
        let body = value.body;
        let image01 = value.image01.url;
        let image02 = value.image02.url;
        let id = value.id;
    
        // 制作実績のHTMLを生成
        lines +=  '<div class="row">\
          <div class="column">\
            <h4 class="works_case_title">'+ title +'</h4>\
            '+ body +'\
          </div>\
          <div class="column">\
            <img src="'+image01+'" width="100%">\
          </div>\
          <div class="column">\
            <img src="'+image02+'" width="100%">\
          </div>\
        </div>\
        ';
        
        if(index + 1 !== data.totalCount){
          lines += '<hr class="line-company">';
        }
      })
      hp_works_disp.html(lines);
    })
    .fail(function() {
      console.log('failed');
    });
  }
});
