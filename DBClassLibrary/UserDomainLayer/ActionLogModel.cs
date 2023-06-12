using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DBClassLibrary.UserDomainLayer.ActionLogModel
{
    public class ContentQueryOption
    {
        //分頁用
        [Display(Name = "目前頁數")]
        public int PageIndex { get; set; }
        [Display(Name = "每頁筆數")]
        public int PageSize { get; set; }
        [Display(Name = "此頁的第一筆")]
        public int minNum { get { return (PageIndex - 1) * PageSize + 1; } }
        [Display(Name = "此頁的最後一筆")]
        public int maxNum { get { return minNum + PageSize - 1; } }

        //查詢條件
        [Display(Name = "單位別")]
        public string UnitID { get; set; }

        [Display(Name = "使用者")]        
        public string RealName { get; set; }

        [Display(Name = "開始日期")]
        [Required(ErrorMessage = "請輸入 [ 開始日期 ]")]
        [DisplayFormat(DataFormatString = "{0:yyyy/MM/dd}")]
        [DataType(DataType.Date, ErrorMessage = "請輸入正確格式的資料")]
        public DateTime StartDate { get; set; }

        [Display(Name = "結束日期")]
        [Required(ErrorMessage = "請輸入 [ 結束日期 ]")]
        [DisplayFormat(DataFormatString = "{0:yyyy/MM/dd}")]
        [DataType(DataType.Date, ErrorMessage = "請輸入正確格式的資料")]
        public DateTime EndDate { get; set; }

        //以下為前端查詢用的欄位        
        [Display(Name = "搜尋詞")]
        public string q { get; set; }

        [Display(Name = "搜尋條件")]
        public string Filter { get; set; }

        public IList<string> Filters { get; set; }

        [Display(Name = "排序方式")]
        public string SortBy { get; set; }

        public string FrontEnd { get; set; }

        public ContentQueryOption()
        {

        }
    }

    /// <summary>
    /// 內容資料
    /// </summary>
    public class ActionLogData
    {
        //內容資料
        public string Controller { get; set; }
        public string Action { get; set; }
        public string Parameters { get; set; }
        public string Content { get; set; }
        public string IP { get; set; }
        public string RealName { get; set; }
        public string UserName { get; set; }

        public string UnitName { get; set; }

        [Display(Name = "時間")]
        [DisplayFormat(DataFormatString = "{0:yyyy/MM/dd HH:mm}")]
        public DateTime UpdateTime { get; set; }

    }

    /// <summary>
    /// 查詢內容資料
    /// </summary>
    public class QueryActionLog : ActionLogData
    {
        [Display(Name = "#")]
        public int RowNum { get; set; }


    }

}
