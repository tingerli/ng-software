import { Http, Headers, ResponseContentType } from '@angular/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';
// import { Http,HttpParams } from "@angular/common/http";
import '../../assets/lib/zui.js';
import '../../assets/lib/datatable/zui.datatable.js';
import '../../assets/lib/chosen/chosen.min.js';
import { DialogModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  results: object[];
  roles: object[];
  softName: string;
  version: string;
  roleIds: string;
  files: object;
  urlPath: string;
  createUserId: number;
  searchName: string;
  display: boolean = false;
  roleIdList: string[];
  enableVal: boolean;
  totalNum: number;
  upDatedVersion: number | string;
  upDatedId: number | string;
  versionDom: object;
  paginateurl: string = "/soft-update/soft_update?";
  totalSize: number = 0;

  constructor(private http: Http) {

  }

  // ======================初始化===============================================

  ngOnInit(): void {
    let basePath = "/soft-update/soft_update?pageNum=1&limit=10";
    let personUrl = "assets/mock-data/list.json";
    let params = new URLSearchParams();

    $(".addBtn").click(function () {
      ($('#myModal') as any).modal();
      console.log(666)
    });

    this.render(basePath);

    let headers = new Headers();
    headers.append('Authorization', 'DG1df5%$^@SD');
    this.http.get('/soft-update/roles?pageNum=1&limit=100', { headers }).subscribe(data => {
      this.roles = data.json()['data']['list'];
      var self = this;
      setTimeout(function () {
        ($('select.chosen-select') as any).chosen({
          no_results_text: '没有找到',    // 当检索时没有找到匹配项时显示的提示文本
          disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
          search_contains: true,         // 从任意位置开始检索
          width: '100%'
        });
        $('select.chosen-select').on('change', function () {
          var str = $("#sel option:selected").map(function () { return $(this).val(); }).get().join("%2C");
          self.roleIds = str;
        });
      })
    });



  }


  // ======================== 方法 ================================================

  showDialog() {
    this.display = true;
  }


  render(url) {
    let headers = new Headers();
    headers.append('Authorization', 'DG1df5%$^@SD');
    this.http.get(url, { headers }).subscribe(data => {
      this.results = data.json()['data']['list'];
      console.log(this.results);
      this.totalNum = data.json()['data'].total;
      var self = this;
      setTimeout(function () {
        // 渲染列表
        ($('table.datatable') as any).datatable({
          checkByClickRow: false,
          storage: false
        });
        ($('table.datatable') as any).datatable('load');

        // 点击查看按钮,查看软件列表权限
        $('.widget-body tbody td button.viewBtn').click(function (e) {

          var target = e.target.parentNode.parentNode;
          var roleID = $(target).children().eq(9).text();

          self.http.get('/soft-update/soft_roles', { params: { role_id: roleID }, headers }).subscribe(data => {
            self.roleIdList = data.json().data.list;
            self.showDialog();
          })

        })

        // 点击启用禁用按钮
        $('.enable').click(function () {
          var enableJson,
            enableURL,
            enableId,
            _self = this;
          enableId = $(this.parentNode.parentNode).children().eq(1)[0].innerHTML;
          enableURL = '/soft-update/soft_update/' + enableId;
          let headers = new Headers();
          headers.append('Authorization', 'DG1df5%$^@SD');
          if ($(this).html() == "未启用") {

            enableJson = {
              "enable": true,
            }
            self.http.put(enableURL, enableJson, { headers }).subscribe(data => {
              if (data.json()['code'] == 200) {
                _self.innerHTML = '已启用';
                _self.className = 'btn-primary btn enable';
              }
            });

          } else {
            enableJson = {
              "enable": false,
            }
            self.http.put(enableURL, enableJson, { headers }).subscribe(data => {
              if (data.json()['code'] == 200) {
                _self.innerHTML = '未启用';
                _self.className = 'btn enable';
              }
            });
          }
        })

        // 点击删除按钮
        $('.delBtn').click(function () {
          if (confirm('是否删除这个软件？')) {
            var delId = $(this.parentNode.parentNode).children().eq(1)[0].innerHTML;
            var delURL = '/soft-update/soft_update/' + delId;
            self.http.delete(delURL, { headers }).subscribe(data => {
              if (data.json()['code'] == 200) {
                $(this.parentNode.parentNode).remove();
              } else {
                alert(data.json()['data']);
              }
            })
          }
        })

        // 编辑按钮
        $('.editBtn').click(function () {
          ($('#myModal2') as any).modal();
          self.versionDom = $(this.parentNode.parentNode).children().eq(3);
          self.upDatedVersion = $(this.parentNode.parentNode).children().eq(3).html();
          self.upDatedId = $(this.parentNode.parentNode).children().eq(1).html();
        })

      });

    });
  }


  onUpload(file) {
    var images = file.target.files[0];
    this.files = images;
  }


  onAddItem() {

    console.log(this.roleIds);
    console.log(this.files);
    this.createUserId = 3;
    this.urlPath = '/soft-update/soft_upload?role_id=' + this.roleIds + '&softName=' + this.softName + '&version=' + this.version + '&createUserId=' + this.createUserId;
    var self = this;
    var images = this.files;
    var data = new FormData();
    (data as any).append('upload', images);
    $.ajax({
      url: self.urlPath,
      type: 'post',
      data: data,
      xhr: function () {
        var myXhr = ($ as any).ajaxSettings.xhr();
        if (myXhr.upload) {
          myXhr.upload.addEventListener('progress', progressHandlingFunction, false);

        }
        return myXhr;
      },
      cache: false,
      contentType: false,    //不可缺，设置请求头的Contend-Type
      processData: false,    //不可缺 把数据转为字符串
      headers: { "Authorization": "DG1df5%$^@SD" },
      success: function (res) {
        alert(res.data);
        ($('#myModal') as any).modal('hide');
      }
    })

    // 上传进度回调函数
    function progressHandlingFunction(e) {
      if (e.lengthComputable) {
        $('progress').attr({
          value: e.loaded,
          max: e.total
        }); //更新数据到进度条
        var percent = e.loaded / e.total * 100;
        $('#progress').html(percent.toFixed(2) + "%");
      }
    }

    $('#myModal').on('hide.zui.modal', function () {
      self.softName = '';
      self.version = '';
      self.roleIds = '';
      self.files = {};
      $("input[type='file']").val('');
      $('select.chosen-select option:selected').prop('selected', false);
      ($('select.chosen-select') as any).trigger('chosen:updated');
       $('#progress').html('');
       $('progress').removeAttr('value');
    })



  }

  onBtnSearch() {
    var searchUrl = '/soft-update/soft_update/search?softName=' + this.searchName + '&pageNum=1&limit=10';
    this.paginateurl = '/soft-update/soft_update/search?softName=' + this.searchName + '&';
    this.render(searchUrl);
  }

  paginate(event) {
    var paginateURL = this.paginateurl + "pageNum=" + (event.page + 1) + "&limit=" + event.rows;
    this.render(paginateURL);
  }

  onEditVersion() {
    let headers = new Headers();
    headers.append('Authorization', 'DG1df5%$^@SD');
    var editId = this.upDatedId,
      editURL = '/soft-update/soft_update/' + editId,
      editJson = {
        "version": this.upDatedVersion
      };
    this.http.put(editURL, editJson, { headers }).subscribe(data => {
      if (data.json()['code'] == 200) {
        ($('#myModal2') as any).modal('hide');
        (this.versionDom as any).html(this.upDatedVersion);
      } else {
        alert(data.json().msg);
      }
    });

  }

  moreDel() {
    let headers = new Headers();
    headers.append('Authorization', 'DG1df5%$^@SD');
    var myDatatable = $('table.datatable').data('zui.datatable');
    var dataArr = myDatatable.checks.checks;
    console.log(dataArr);
    var ids = '';
    for (var i = 0; i < dataArr.length; i++) {
      var id = $('table.datatable tbody').children().eq(dataArr[i]).children()[0].innerHTML;
      console.log(id);
      ids += id + ',';
    }
    ids = ids.substring(0, ids.length - 1);
    console.log(ids);

    if (confirm('是否删除这些软件')) {
      this.http.delete('/soft-update/soft_update', { params: { ids: ids }, headers }).subscribe(data => {
        if (data.json()['code'] == 200) {
          $('tr.active').remove();
        }
      })
    }
  }


}
