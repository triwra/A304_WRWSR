using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace DBClassLibrary.UserDomainLayer.RainModel
{
    class RainModel
    {
    }

    /// <summary>
    /// 嘉南水利會提供的雨量即時資料
    /// </summary>
    public class RainFallDataRootObject
    {
        public string DateTime { get; set; }
        public RainFallData[] Data { get; set; }
    }

    /// <summary>
    /// 雨量即時資料(值)
    /// </summary>
    public class RainFallData
    {        
        public DateTime DataTime { get; set; }
        public string StationNo { get; set; }
        //public string StationName { get; set; }
        public string M10 { get; set; }
        public string M30 { get; set; }
        public string H1 { get; set; }
        public decimal? H2 { get; set; }
        public decimal? H6 { get; set; }
        public decimal? H12 { get; set; }
        public decimal? H24 { get; set; }
        public decimal? H48 { get; set; }
        public string D1 { get; set; }
        public decimal? D2 { get; set; }
        public decimal? D3 { get; set; }
    }

    /// <summary>
    /// 雨量即時資料(值)
    /// </summary>
    public class RainFallData2
    {
        public DateTime DataTime { get; set; }
        public string StationNo { get; set; }        
        public decimal? M10 { get; set; }
        public decimal? M30 { get; set; }
        public decimal? H1 { get; set; }
        public decimal? H2 { get; set; }
        public decimal? H6 { get; set; }
        public decimal? H12 { get; set; }
        public decimal? H24 { get; set; }
        public decimal? H48 { get; set; }
        public decimal? D1 { get; set; }
        public decimal? D2 { get; set; }
        public decimal? D3 { get; set; }
    }

    /// <summary>
    /// 雨量站權重資料   
    /// </summary>
    public class RainStationWeight
    {
        public string StationNo { get; set; }
        public string StationCode { get; set; }
        public string SourceType { get; set; }
        public short AreaID { get; set; }
        public string StationName { get; set; }
        public decimal Weight { get; set; }
    }

    /// <summary>
    /// 雨量站權重資料(即時資料使用)
    /// </summary>
    public class RainStationRealTimeWeight
    {
        public short AreaID { get; set; }
        public string StationName { get; set; }
        public string StationNo { get; set; }
        public string StationCode { get; set; }
        public string SourceType { get; set; }
        public decimal Weight { get; set; }
        public string Backup1Name { get; set; }
        public string Backup1Code { get; set; }
        public string Backup1SourceType { get; set; }
        public string Backup2Name { get; set; }
        public string Backup2Code { get; set; }
        public string Backup2SourceType { get; set; }
    }

    #region 灌區的平均雨量

    /// <summary>
    /// 灌區的即時平均雨量 (各延時欄位)
    /// </summary>
    public class RainValueAverageDuration
    {
        public string AreaID { get; set; }
        public DateTime DataTime { get; set; }
        public decimal? M10 { get; set; }
        public decimal? H1 { get; set; }
        public decimal? D1 { get; set; }
    }

    /// <summary>
    /// 查詢灌區的即時平均雨量 (各延時欄位)
    /// </summary>
    public class QueryRainValueAverageDuration : RainValueAverageDuration
    {
        public string AreaName { get; set; }
    }

    /// <summary>
    /// 即時平均雨量資料最大時間 (各延時欄位)
    /// 即時平均雨量資料最小時間 (各延時欄位)
    /// </summary>
    public class RealTimeRainMaxMinDataTime : RainValueAverageDuration
    {
        public DateTime MaxDataTime { get; set; }
        public DateTime MinDataTime { get; set; }
    }

    //查詢灌區各站的即時雨量
    public class QueryRainfallRealTimeInfo : RainFallData2
    {
        public string AreaID { get; set; }
        public string AreaName { get; set; }
        public string StationName { get; set; }
        public string SourceType { get; set; }
    }

    //查詢灌區歷史平均雨量
    public class QueryRainfallHistoryInfo
    {
        public short AreaID { get; set; }
        public string AreaName { get; set; }
        public string StationNo { get; set; }
        public string StationName { get; set; }
        public int? Year { get; set; }
        public int? Month { get; set; }
        public decimal? RainVal_Max_M { get; set; }
        public decimal? RainVal_SUM_M { get; set; }
        public int? RainVal_Count_M { get; set; }
        public decimal? RainVal_SUM_Y { get; set; }
        public decimal? D1 { get; set; }
        public decimal? D2 { get; set; }
        public decimal? D3 { get; set; }
        public decimal? D4 { get; set; }
        public decimal? D5 { get; set; }
        public decimal? D6 { get; set; }
        public decimal? D7 { get; set; }
        public decimal? D8 { get; set; }
        public decimal? D9 { get; set; }
        public decimal? D10 { get; set; }
        public decimal? D11 { get; set; }
        public decimal? D12 { get; set; }
        public decimal? D13 { get; set; }
        public decimal? D14 { get; set; }
        public decimal? D15 { get; set; }
        public decimal? D16 { get; set; }
        public decimal? D17 { get; set; }
        public decimal? D18 { get; set; }
        public decimal? D19 { get; set; }
        public decimal? D20 { get; set; }
        public decimal? D21 { get; set; }
        public decimal? D22 { get; set; }
        public decimal? D23 { get; set; }
        public decimal? D24 { get; set; }
        public decimal? D25 { get; set; }
        public decimal? D26 { get; set; }
        public decimal? D27 { get; set; }
        public decimal? D28 { get; set; }
        public decimal? D29 { get; set; }
        public decimal? D30 { get; set; }
        public decimal? D31 { get; set; }
    }

    //
    public class RainValueAverageTimeSeries: RainValueAverage
    {
        public decimal RainValue_Acc { get; set; }
        public decimal RainValueEffective_Acc { get; set; }
    }


    /// <summary>
    /// 各站的雨量值及對映的權重
    /// </summary>
    public class RainStationDurationWithWeight
    {
        public string StationNo { get; set; }
        public decimal Weight { get; set; }
        public DateTime DataTime { get; set; }
        public decimal? M10 { get; set; }
        public decimal? H1 { get; set; }
        public decimal? D1 { get; set; }
    }

    /// <summary>
    /// 各站的雨量值及對映的權重
    /// </summary>
    public class RainStationRainValueWithWeight
    {
        public string StationNo { get; set; }
        public decimal Weight { get; set; }
        public DateTime DataTime { get; set; }
        public decimal? RainValue { get; set; }
    }

    /// <summary>
    /// 灌區的平均雨量
    /// </summary>
    public class RainValueAverage
    {
        public int AreaID { get; set; }
        public DateTime DataTime { get; set; }
        public decimal RainValue { get; set; }
        /// <summary>
        /// 有效雨量值
        /// </summary>
        public decimal RainValueEffective { get; set; }
        /// <summary>
        /// 累計平均雨量
        /// </summary>
        public decimal RainValueSigma { get; set; }

        /// <summary>
        /// 有效雨量值的最大門檻記錄
        /// </summary>
        public decimal RainValueEffectiveLimit { get; set; }

        /// <summary>
        /// 有效雨量的經過天數
        /// </summary>
        public int Duration { get; set; }

    }

    /// <summary>
    /// 降雨場次記錄
    /// </summary>
    public class RainfallSession
    {
        public int AreaID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Duration { get; set; }
        public decimal RainValueSigma { get; set; }
        public decimal RainValueEffectiveAdd { get; set; }
    }

    #endregion 灌區的平均雨量


    #region WRWSR 列舉


    #endregion WRWSR

    #region WRWSR 雨量查詢

    public class DashBoardRainfallData
    {
        public String ReservoirGroup { get; set; }
        public String ReservoirGroupName { get; set; }
        public String MaxTime { get; set; }
        public int? PassMonthIndex { get; set; }
        public decimal? Rain { get; set; }
        public decimal? AVG_Val { get; set; }
        public decimal? Percentage { get; set; }
    }
    public class RealTimeGridCumulativeDailyRainfall
    {
        public DateTime DataTime { get; set; }
        public string BoundaryID { get; set; }
        public string BoundaryName { get; set; }
        public int? BoundaryType { get; set; }
        public decimal? Rain { get; set; }
    }

    public class GridRainfallValue
    {
        public DateTime DataTime { get; set; }
        public double? X1 { get; set; }
        public double? Y1 { get; set; }
        public decimal? DataValue { get; set; }
        public decimal? GridNumber { get; set; }
    }
    #endregion

    #region WRWSR 累積雨量超越機率

    public class GBRHTenDaysRainfallData
    {
        public int DataType { get; set; }
        public string BoundaryID { get; set; }
        public int BoundaryType { get; set; }
        public int YearValue { get; set; }
        public int TypeValue { get; set; }
        public decimal Rain { get; set; }
    }
    public class FhyAverageTenDaysRainfall
    {

        public string StationNo { get; set; }
        public int? TenDayNo { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal? AccumulatedRainfall_AVG { get; set; }
        public decimal? InflowTotal_AVG { get; set; }
        public int? TenDayNoCount { get; set; }

    }

    public class GridAverageTenDaysRainfall
    {

        public string BoundaryID { get; set; }
        public int? DataTypeValue { get; set; }
        public string BoundaryType { get; set; }
        public string DataType { get; set; }
        public string FieldName { get; set; }
        public string MDDate { get; set; }
        public decimal? AccumulatedRainfall_AVG { get; set; }
        public decimal? AverageValue_AVG { get; set; }

    }

    public class TenDaysQData
    {
        
        public DateTime DateTime { get; set; }
        public string BoundaryID { get; set; }
        public int BoundaryType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PiField { get; set; }
        public string PiType { get; set; }
        public int? PiTypeValue { get; set; }
        public int? PiCalcType { get; set; }
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
        public decimal QminAverageValue { get; set; }

    }

    #endregion

    #region WRWSR 乾旱監測(SPI)

    public class VariableScaleSPI
    {
        public string LabelName { get; set; }
        public string DataArea { get; set; }
        public string YearValue { get; set; }
        public string DataTypeValue { get; set; }
        public decimal? Rainfall { get; set; }
        public decimal? SPI1 { get; set; }
        public decimal? vsSPI { get; set; }
        public string value { get; set; }
        public string No { get; set; }
        public int? Level { get; set; }
    }

    #endregion WRWSR 乾旱監測(SPI)

    #region WRWSR 實際有效雨量分析
    public class ActualEffectiveRainfallData
    {
        public int DataType { get; set; }
        public string BoundaryID { get; set; }
        public string WorkStationName { get; set; }
        public int BoundaryType { get; set; }
        public int YearValue { get; set; }
        public int MonthValue { get; set; }
        public int TypeValue { get; set; }
        public string TypeValueText { get; set; }
        public decimal? EffectiveRainfall { get; set; }
    }
    #endregion WRWSR 實際有效雨量分析

    #region WRWSR 歷史同期雨量枯旱排名
    public class RainRankData
    {
        public int DataType { get; set; }
        public string BoundaryID { get; set; }
        public string Name { get; set; }
        public int BoundaryType { get; set; }
        public DateTime StartDate { get; set; }
        public string StartDateStr
        {
            get
            {
                return StartDate.ToString("yyyy-MM-dd");
            }
        }
        public string StartMDDateStr
        {
            get
            {
                return StartDate.ToString("MM-dd");
            }
        }
        public DateTime EndDate { get; set; }
        public string EndDateStr
        {
            get
            {
                return EndDate.ToString("yyyy-MM-dd");
            }
        }
        public string EndMDDateStr
        {
            get
            {
                return EndDate.ToString("MM-dd");
            }
        }
        public decimal? value { get; set; }
        public int? DayCount { get; set; }
        public int? MissDayCount { get; set; }        
        public int? Rank { get; set; }
    }
    #endregion WRWSR 歷史同期雨量枯旱排名

    #region 有效雨量分析

    /// <summary>
    /// 各邊界即時有效雨量資料(PIVOT月) 
    /// </summary>
    public class GBER_PIVOT_Month
    {
        public string SystemName { get; set; }
        public string BoundaryID { get; set; }
        public int BoundaryType { get; set; }
        public decimal? T1 { get; set; }
        public decimal? T2 { get; set; }
        public decimal? T3 { get; set; }
        public decimal? T4 { get; set; }
        public decimal? T5 { get; set; }
        public decimal? T6 { get; set; }
        public decimal? T7 { get; set; }
        public decimal? T8 { get; set; }
        public decimal? T9 { get; set; }
        public decimal? T10 { get; set; }
        public decimal? T11 { get; set; }
        public decimal? T12 { get; set; }
    }

    public class GBER_PIVOT_Tendays
    {
        public string SystemName { get; set; }
        public string BoundaryID { get; set; }
        public int BoundaryType { get; set; }
        public decimal? T1 { get; set; }
        public decimal? T2 { get; set; }
        public decimal? T3 { get; set; }
        public decimal? T4 { get; set; }
        public decimal? T5 { get; set; }
        public decimal? T6 { get; set; }
        public decimal? T7 { get; set; }
        public decimal? T8 { get; set; }
        public decimal? T9 { get; set; }
        public decimal? T10 { get; set; }
        public decimal? T11 { get; set; }
        public decimal? T12 { get; set; }
        public decimal? T13 { get; set; }
        public decimal? T14 { get; set; }
        public decimal? T15 { get; set; }
        public decimal? T16 { get; set; }
        public decimal? T17 { get; set; }
        public decimal? T18 { get; set; }
        public decimal? T19 { get; set; }
        public decimal? T20 { get; set; }
        public decimal? T21 { get; set; }
        public decimal? T22 { get; set; }
        public decimal? T23 { get; set; }
        public decimal? T24 { get; set; }
        public decimal? T25 { get; set; }
        public decimal? T26 { get; set; }
        public decimal? T27 { get; set; }
        public decimal? T28 { get; set; }
        public decimal? T29 { get; set; }
        public decimal? T30 { get; set; }
        public decimal? T31 { get; set; }
        public decimal? T32 { get; set; }
        public decimal? T33 { get; set; }
        public decimal? T34 { get; set; }
        public decimal? T35 { get; set; }
        public decimal? T36 { get; set; }
    }




    #endregion 有效雨量分析


}
