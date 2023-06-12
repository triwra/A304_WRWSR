using System;

namespace DBClassLibrary.UserDomainLayer
{
    class CalcModel
    {
    }

    /// <summary>
    /// 歷年排名的依據方式
    /// </summary>
    public enum SummarySortType
    {
        RiverFlowRateTotal = 1,
    }

    /// <summary>
    /// 計算週期種類(合計, 平均)
    /// </summary>
    public enum SummaryType
    {
        Year = 1,
        Month = 2,
        TenDays = 3,     
    }

    /// <summary>
    /// 計算合計, 平均的來源欄位
    /// </summary>
    public enum SummaryField
    {
        //雨量
        Rain,

        //水庫
        AccumulatedRainfall,
        InflowTotal
    }

    /// <summary>
    /// 計算週期種類(超越機率)
    /// </summary>
    public enum PiType
    {
        Year = 1,
        Month = 2,
        TenDays = 3,      
    }

    /// <summary>
    /// 計算時的採用值種類(超越機率)
    /// </summary>
    public enum PiField
    {
        //雨量
        Rain,

        //水庫
        AccumulatedRainfall,
        InflowAverage,
        InflowTotal
    }

    /// <summary>
    /// 邊界種類
    /// </summary>
    public enum BoundaryType
    {
        Reservoir = 1,  //水庫
        Barrage = 2,    //攔河堰
        IA = 3,         //管理處
        IAMng = 4,      //分處(管理處+灌區)
        WorkStation = 5, //工作站
    }

    /// <summary>
    /// 超越機率點繪法種類
    /// </summary>
    public enum PiCalcType
    {
        Weibull = 1,   //韋伯分布
        Triwra = 2,    //台農院的算法
    }

    /// <summary>
    /// 超越機率採用值的名單
    /// </summary>
    public class ItemValuePi
    {
        public decimal ItemValue { get; set; }
        public long SortFlag { get; set; }
        public decimal Pi { get; set; }
    }

    /// <summary>
    /// 超越機率表單 (依日期區間存放計算的結束)
    /// </summary>
    public class PiValue
    {
        public string BoundaryID { get; set; }
        public int BoundaryType { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PiField { get; set; }
        public string PiType { get; set; }
        public int PiTypeValue { get; set; }
        public int PiCalcType { get; set; }
        public DateTime PiTypeValueDate { get; set; }
        public decimal Q10 { get; set; }
        public decimal Q20 { get; set; }
        public decimal Q30 { get; set; }
        public decimal Q40 { get; set; }
        public decimal Q50 { get; set; }
        public decimal Q60 { get; set; }
        public decimal Q70 { get; set; }
        public decimal Q75 { get; set; }
        public decimal Q80 { get; set; }
        public decimal Q85 { get; set; }
        public decimal Q90 { get; set; }
        public decimal Q95 { get; set; }
        public decimal QAverage { get; set; }
    }

    /// <summary>
    /// 各項數值的合計, 平均 (tbl_DataSourceSummary)
    /// </summary>
    public class SummaryValue
    {
        public string BoundaryID { get; set; }
        public int BoundaryType { get; set; }
        public string DataType { get; set; }
        public DateTime DataTypeValueDate { get; set; }
        public string FieldName { get; set; }
        public int DataTypeValue { get; set; }

        public decimal TotalValue { get; set; }
        public decimal AverageValue
        {
            get
            {
                return DataCount > 0 ? TotalValue / DataCount : 0;
            }
        }
        public int DataCount { get; set; }
        public int DataMissCount { get; set; }
    }

}
