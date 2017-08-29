import { Component, OnInit } from '@angular/core';
import '../../assets/lib/zui.js';
import '../../assets/lib/datatable/zui.datatable.js';
import  '../../assets/lib/chosen/chosen.min.css';
import '../../assets/lib/chosen/chosen.min.js';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    ($('select.chosen-select') as any).chosen({
      no_results_text: '没有找到',    // 当检索时没有找到匹配项时显示的提示文本
      disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
      search_contains: true         // 从任意位置开始检索
    });
  }

}
