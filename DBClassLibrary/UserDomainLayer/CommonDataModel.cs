using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Reflection;

namespace DBClassLibrary.UserDomainLayer.CommonDataModel
{
    public class AppParam
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string Label { get; set; }
        public string Value { get; set; }
        public int Ordinal { get; set; }
        public string Note { get; set; }

        public AppParam Clone()
        {
            return this.MemberwiseClone() as AppParam;
        }
    }

    /// <summary>
    /// 旬日期範圍
    /// </summary>
    public class TenDaysPeriodData
    {
        /// <summary>
        /// 全年中的旬別編號
        /// </summary>
        public int TenDaysOfYear { get; set; }
        /// <summary>
        /// 旬別
        /// </summary>
        public int TenDaysType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public TenDaysPeriodData Clone()
        {
            return this.MemberwiseClone() as TenDaysPeriodData;
        }
    }

    #region ActionLog 相關

    /// <summary>
    /// JsonSerializer 可讀取屬性的解析器設定
    /// </summary>
    public class ReadablePropertiesResolver : DefaultContractResolver
    {
        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
        {
            JsonProperty property = base.CreateProperty(member, memberSerialization);
            if (typeof(Stream).IsAssignableFrom(property.PropertyType))
            {
                property.Ignored = true;
            }
            return property;
        }
    }

    public class ActionLog
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
        public string Parameters { get; set; }
        public string IP { get; set; }
        public DateTime UpdateTime { get; set; }
    }

    public class AppUserData
    {
        public string UserId { get; set; }
        public DateTime AccountCreateTime { get; set; }
        public DateTime? LastLoginTime { get; set; }
        public DateTime? LastAccessTime { get; set; }
        public DateTime? LastChangePwdTime { get; set; }
    }

    #endregion ActionLog 相關

    #region 固定的選單資料

    /// <summary>
    /// 共用的名單
    /// </summary>
    public class CommonFieldList
    {
        [Display(Name = "編號")]
        public string ItemID { get; set; }
        [Display(Name = "名稱")]
        public string ItemName { get; set; }
    }

    /// <summary>
    /// 查詢內容資料筆數
    /// </summary>
    public class QueryDataCountByClass
    {
        public int ClassID { get; set; }
        public string ClassName { get; set; }
        public int? RowsCount { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
    }

    #endregion 固定的選單資料

    #region 管理處 相關

    /// <summary>
    /// 各管理處工作站名單
    /// </summary>
    public class IAStation
    {
        public string WorkStationId { get; set; }
        public string IANo { get; set; }
        public string IAName { get; set; }
        public string MngNo { get; set; }
        public string WorkStationNo { get; set; }
        public string WorkStationName { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Area { get; set; }
    }

    #endregion 管理處 相關
}
