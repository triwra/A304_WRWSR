using DBClassLibrary.UserDomainLayer.FhyAPIModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;

namespace DBClassLibrary.UserDomainLayer.ReservoirModel
{
    public class ReservoirModel
    {
    }

    #region 批次程式使用

    /// <summary>
    /// 水庫資料名稱
    /// </summary>
    public enum DataTypeName
    {
        蓄水量 = 1,
        累積降雨量 = 2,
        累積入流量 = 3
    }

    /// <summary>
    /// 歷年排名的依據方式
    /// </summary>
    public enum DataType
    {
        EffectiveStorage = 1,
        AccumulatedRainfall = 2,
        Inflow = 3
    }

    /// <summary>
    /// 歷年排名的依據方式
    /// </summary>
    public enum SummarySortType
    {
        EffectiveStorageTotal = 1,
        AccumulatedRainfallTotal = 2,
        InflowTotal = 3
    }

    /// <summary>
    /// 計算週期種類(合計, 平均)
    /// </summary>
    public enum SummaryType
    {
        Year = 1,
        Month = 2,
        TenDays = 3,
        C11010531 = 4,  //計算 11/01~05/31 C 代表有跨年度
        T01010531 = 5,   //計算 01/01~05/31 T 代表不跨年度
        T01011231 = 6,   //計算 01/01~12/31 T 代表不跨年度

    }

    /// <summary>
    /// 計算週期種類(超越機率)
    /// </summary>
    public enum PiType
    {
        Year = 1,
        Month = 2,
        TenDays = 3,
        Day = 4,
        T01011231 = 5,   //計算 01/01~12/31 T 代表不跨年度
    }

    /// <summary>
    /// 計算時的採用值種類(超越機率)
    /// </summary>
    public enum PiField
    {
        //從 tbl_ReservoirDataHistory 的欄位計算(目前已不使用)
        InflowTotal = 1,
        AccumulatedRainfall = 2,
        //從 tbl_ReservoirDataSummary 的欄位計算
        InflowTotalAverageValue = 10,
        AccumulatedRainfallTotalValue = 20,
    }

    /// <summary>
    /// 水庫的超越機率採用值
    /// </summary>
    public class RservoirItemValuePi
    {
        public decimal ItemValue { get; set; }
        public long SortFlag { get; set; }
        public decimal Pi { get; set; }
    }

    #endregion 批次程式使用

    /// <summary>
    /// 超越機率表單 (依日期區間存放計算的結束)
    /// </summary>
    public class ReservoirPiValue
    {
        public string StationNo { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PiType { get; set; }
        public string PiField { get; set; }
        public int PiTypeValue { get; set; }
        public int PiTypeTenDaysValue
        {
            get
            {
                return ((PiTypeValue + 5) % 36) + 1;
            }
        }
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
    /// 水庫各項數值的合計, 平均
    /// </summary>
    public class ReservoirSummaryValue
    {
        public string StationNo { get; set; }
        public string DataType { get; set; }
        public DateTime DataTypeValueDate { get; set; }
        public int DataTypeValue { get; set; }

        public decimal EffectiveStorageTotal { get; set; }
        public decimal EffectiveStorageAverage
        {
            get
            {
                return EffectiveStorageCount > 0 ? EffectiveStorageTotal / EffectiveStorageCount : 0;
            }
        }
        public int EffectiveStorageCount { get; set; }
        public int EffectiveStorageMissCount { get; set; }

        public decimal AccumulatedRainfallTotal { get; set; }
        public decimal AccumulatedRainfallAverage
        {
            get
            {
                return AccumulatedRainfallCount > 0 ? AccumulatedRainfallTotal / AccumulatedRainfallCount : 0;
            }
        }
        public int AccumulatedRainfallCount { get; set; }
        public int AccumulatedRainfallMissCount { get; set; }

        public decimal InflowTotal { get; set; }
        public decimal InflowAverage
        {
            get
            {
                return InflowCount > 0 ? InflowTotal / InflowCount : 0;
            }
        }

        public int InflowCount { get; set; }
        public int InflowMissCount { get; set; }

        public decimal OutflowTotal { get; set; }
        public decimal OutflowAverage
        {
            get
            {
                return OutflowCount > 0 ? OutflowTotal / OutflowCount : 0;
            }
        }
        public int OutflowCount { get; set; }
        public int OutflowMissCount { get; set; }
    }

    /// <summary>
    /// 水庫基本資料
    /// </summary>
    public class ReservoirInfo
    {
        public string StationNo { get; set; }
        public string StationName { get; set; }
        public string CityCode { get; set; }
        public string BasinCode { get; set; }
        public decimal? EffectiveCapacity { get; set; }
        public decimal? FullWaterHeight { get; set; }
        public decimal? DeadWaterHeight { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? Storage { get; set; }
        public short? ProtectionFlood { get; set; }
        public short? HydraulicConstruction { get; set; }
        public short? Importance { get; set; }
    }

    /// <summary>
    /// 水庫即時資料
    /// </summary>
    public class ReservoirRealTimeData
    {
        public string StationNo { get; set; }
        public DateTime DataTime { get; set; }
        public decimal? HourMeanRain { get; set; }
        public decimal? AccumulatedRainfall { get; set; }
        public decimal? WaterHeight { get; set; }
        public decimal? EffectiveCapacity { get; set; }
        public decimal? EffectiveStorage { get; set; }
        public decimal? PercentageOfStorage { get; set; }
        public decimal? OperationalStorage { get; set; }
        public decimal? Inflow { get; set; }
        public decimal? Outflow { get; set; }
        public short? Status { get; set; }
        public DateTime? NextSpillTime { get; set; }
        public decimal? Discharge { get; set; }
        public decimal? DischargeOfProtectionFlood { get; set; }
        public decimal? DischargeOfEscapeSand { get; set; }
        public decimal? DischargeOfHydroelectric { get; set; }
        public decimal? DischargeOfOthers { get; set; }

        public decimal? DeadWaterHeight { get; set; }
        public decimal? FullWaterHeight { get; set; }
        //public decimal? InflowTotal { get; set; }
        //public decimal? OutflowTotal { get; set; }

        public decimal? EvaporateLoss { get; set; }
        public decimal? Evaporate { get; set; }
    }

    /// <summary>
    /// 水庫即時資料
    /// </summary>
    public class ReservoirInfoData : ReservoirRealTimeData
    {
        public string StationName { get; set; }
        public int? LimitType { get; set; }
        public int? LowerLimit { get; set; }
        public int? SeriousLowerLimit { get; set; }
        public int? SafeWater { get; set; }
        public string ReservoirGroup { get; set; }
        public string ReservoirGroupName { get; set; }
        public string WarningLevel { get; set; }

        public string STR_Date { get; set; }

    }

    /// <summary>
    /// 水庫即時資料加基本資料
    /// </summary>
    public class QueryReservoirRealTimeData : ReservoirRealTimeData
    {
        public string StationName { get; set; }
    }

    /// <summary>
    /// 水庫單日蓄水量排名
    /// </summary>
    public class SingleDayEffectiveStorageData
    {
        public int Year { get; set; }
        public int ROCYear { get; set; }
        public int Annual { get; set; }
        public string MDDate { get; set; }
        public decimal EffectiveStorage_30502 { get; set; }
        public decimal EffectiveStorage_30501 { get; set; }
        public decimal EffectiveStorage { get; set; }
        public string State { get; set; }
        public int Rank { get; set; }
    }


    /// <summary>
    /// 計算週期種類(超越機率)
    /// </summary>

    /// <summary>
    /// 水庫的超越機率採用值
    /// </summary>

    /// <summary>
    /// 水庫各項數值的合計, 平均
    /// </summary>

    /// <summary>
    /// 水庫基本資料
    /// </summary>

    #region 查詢資料時使用



    /// <summary>
    /// 水庫規線
    /// </summary>
    public class ReservoirRule
    {
        public int Sn { get; set; }
        public string StationNo { get; set; }
        public string DataDate { get; set; }
        public string TenDays { get; set; }
        public int LowerLimit { get; set; }
        public int SeriousLowerLimit { get; set; }

        public int SafeWater { get; set; }
    }

    #endregion 查詢資料時使用
    /// <summary>
    /// 水庫即時資料
    /// </summary>

    /// <summary>
    /// 水庫規線
    /// </summary>

    /// <summary>
    /// 水庫單日蓄水量排名
    /// </summary>

    #region 前端取資料用

    #region 水庫


    public class ReservoirRuleData
    {
        public int StationNo { get; set; }
        public DateTime DataDate { get; set; }
        public string MDDate
        {
            get
            {
                return DataDate.ToString("MM-dd");
            }
        }
        public int month { get; set; }
        public string TenDays { get; set; }
        public float LowerLimit { get; set; }
        public float SeriousLowerLimit { get; set; }
        public int day { get; set; }
    }

    public class ReservoirWithRealTimeData
    {
        public string StationNo { get; set; }

        public string StationName { get; set; }
    }

    public class RainfallRealTimeData
    {
        public DateTime DataDay { get; set; }

        public float Rainfall { get; set; }
    }

    public class PoundTimeData
    {
        public string FileTime { get; set; }
        public string ChineseFileTime { get; set; }
    }

    public class PoundRealTimeInfo
    {
        public string IANo { get; set; }
        public string WorkStationId { get; set; }
        public string IAName { get; set; }
        public string WorkStationName { get; set; }
        public string ChannelName { get; set; }

        public string fileTime { get; set; }
        public int? PondCount { get; set; }
        public string PondCapacity { get; set; }
        public int? PondStorage { get; set; }
        public int? PercentageOfPondStorage { get; set; }
        public string previousFileTime { get; set; }
        public int? previousPondStorage { get; set; }
        public string ChineseFileTime { get; set; }

    }
    /// <summary>
    /// 時間序列資料
    /// </summary>
    public class ReservoirTimeSeriesData
    {
        /// <summary>
        /// 時間序列基本欄位
        /// </summary>
        public class Basic
        {
            public DateTime DataTime { get; set; }
            public string DataTimeStr
            {
                get
                {
                    return DataTime.ToString("yyyy-MM-dd");
                }
            }
            public DateTime ChartTime { get; set; }
            public string ChartTimeStr
            {
                get
                {
                    return ChartTime.ToString("yyyy-MM-dd");
                }
            }
        }

        public class RealTimeData : Basic
        {
            public decimal? EffectiveStorage1 { get; set; }
            public decimal? AccumulatedRainfall { get; set; }
            public decimal? InflowTotal { get; set; }
            public decimal? InflowTotal_ACC { get; set; }
            public decimal? AccumulatedRainfall_ACC { get; set; }
            public decimal? EffectiveStorage_30501 { get; set; }
            public decimal? AccumulatedRainfall_30501 { get; set; }
            public decimal? Inflow_30501 { get; set; }
            public decimal? EffectiveStorage_30502 { get; set; }
            public decimal? AccumulatedRainfall_30502 { get; set; }
            public decimal? Inflow_30502 { get; set; }
            public decimal? EffectiveStorage_Bind { get; set; }
            public decimal? InflowTotal_ACC_30501 { get; set; }
            public decimal? InflowTotal_ACC_30502 { get; set; }
            public decimal? AccumulatedRainfall_ACC_30501 { get; set; }
            public decimal? AccumulatedRainfall_ACC_30502 { get; set; }
        }

        public class ReservoirRuleData : Basic
        {
            public decimal? LowerLimit { get; set; }
            public decimal? SeriousLowerLimit { get; set; }
        }

        public class PiValueData : Basic
        {
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

        public class HistoryData : Basic
        {
            public decimal? EffectiveStorage { get; set; }
            public decimal? AccumulatedRainfall { get; set; }
            public decimal? InflowTotal { get; set; }
            public decimal? InflowTotal_ACC { get; set; }
            public decimal? AccumulatedRainfall_ACC { get; set; }
            public decimal? EffectiveStorage_30501 { get; set; }
            public decimal? AccumulatedRainfall_30501 { get; set; }
            public decimal? Inflow_30501 { get; set; }
            public decimal? EffectiveStorage_30502 { get; set; }
            public decimal? AccumulatedRainfall_30502 { get; set; }
            public decimal? Inflow_30502 { get; set; }
            public decimal? EffectiveStorage_Bind { get; set; }
            public decimal? InflowTotal_ACC_30501 { get; set; }
            public decimal? AccumulatedRainfall_ACC_30501 { get; set; }
            public decimal? InflowTotal_ACC_30502 { get; set; }
            public decimal? AccumulatedRainfall_ACC_30502 { get; set; }
        }

        public class HistoryDataSet
        {
            public string Year { get; set; }
            public IEnumerable<HistoryData> Data { get; set; }
        }

        public class AverageData : Basic
        {
            public decimal? EffectiveStorage_AVG { get; set; }
            public decimal? AccumulatedRainfall_AVG { get; set; }
            public decimal? InflowTotal_AVG { get; set; }
            public decimal? InflowTotal_AVG_ACC { get; set; }
            public decimal? AccumulatedRainfall_AVG_ACC { get; set; }
            public decimal? EffectiveStorage_AVG_30501 { get; set; }
            public decimal? AccumulatedRainfall_AVG_30501 { get; set; }
            public decimal? InflowTotal_AVG_30501 { get; set; }
            public decimal? EffectiveStorage_AVG_30502 { get; set; }
            public decimal? AccumulatedRainfall_AVG_30502 { get; set; }
            public decimal? InflowTotal_AVG_30502 { get; set; }
            public decimal? EffectiveStorage_AVG_BIND { get; set; }
            public decimal? InflowTotal_AVG_ACC_30501 { get; set; }
            public decimal? AccumulatedRainfall_AVG_ACC_30501 { get; set; }
            public decimal? InflowTotal_AVG_ACC_30502 { get; set; }
            public decimal? AccumulatedRainfall_AVG_ACC_30502 { get; set; }
        }
    }

    /// <summary>
    /// 排名資料
    /// </summary>
    public class ReservoirRankData
    {
        public string OptStartDate { get; set; }
        public string OptEndDate { get; set; }
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
        public string Annual
        {
            get
            {
                return (StartDate.Year - 1911).ToString();
            }
        }
        public decimal EffectiveStorage { get; set; }
        public decimal EffectiveCapacity { get; set; }
        public decimal TotalRainfall { get; set; }
        public decimal TotalInflow { get; set; }
        public decimal EffectiveStorage_30501 { get; set; }
        public decimal EffectiveStorage_30502 { get; set; }
        public decimal EffectiveStorage_BIND { get; set; }
        public decimal EffectiveCapacity_30501 { get; set; }
        public decimal EffectiveCapacity_30502 { get; set; }
        public decimal EffectiveCapacity_BIND { get; set; }
        public decimal TotalRainfall_30501 { get; set; }
        public decimal TotalRainfall_30502 { get; set; }
        public decimal TotalInflow_30501 { get; set; }
        public decimal TotalInflow_30502 { get; set; }
    }



    public class SummaryPiValue
    {
        public int StationNo { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PiType { get; set; }
        public string PiField { get; set; }
        public decimal Q10_SUM { get; set; }
        public decimal Q20_SUM { get; set; }
        public decimal Q30_SUM { get; set; }
        public decimal Q40_SUM { get; set; }
        public decimal Q50_SUM { get; set; }
        public decimal Q60_SUM { get; set; }
        public decimal Q70_SUM { get; set; }
        public decimal Q75_SUM { get; set; }
        public decimal Q80_SUM { get; set; }
        public decimal Q85_SUM { get; set; }
        public decimal Q90_SUM { get; set; }
        public decimal Q95_SUM { get; set; }
        public decimal QAverage_SUM { get; set; }
    }


    #endregion

    #endregion

    #region WRWSR 水庫

    public class ReservoirData
    {
        public string StationNo { get; set; }
        public DateTime Time { get; set; }
        public DateTime Info_Time { get; set; }
        public string Date { get; set; }
        public string MDDate { get; set; }
        public decimal? WaterHeight { get; set; }
        public string Annual
        {
            get
            {
                return (Time.Year - 1911).ToString();
            }
        }
        public string StartDateStr
        {
            get
            {
                return Time.ToString("yyyy-MM-dd");
            }
        }
        public string StartMDDateStr
        {
            get
            {
                return Time.ToString("MM-dd");
            }
        }
        public decimal? EffectiveStorage { get; set; }
        public decimal? EffectiveCapacity { get; set; }
        public decimal? AccumulatedRainfall { get; set; }
        public decimal? InflowTotal { get; set; }
        public decimal? OutflowTotal { get; set; }
        public string PercentageOfStorage { get; set; }
    }


    public class EffectiveStorageRankData
    {
        public string StationNo { get; set; }
        public DateTime Time { get; set; }
        public string Annual
        {
            get
            {
                return (Time.Year - 1911).ToString();
            }
        }
        public string StartDateStr
        {
            get
            {
                return Time.ToString("yyyy-MM-dd");
            }
        }
        public string StartMDDateStr
        {
            get
            {
                return Time.ToString("MM-dd");
            }
        }
        public decimal EffectiveStorage { get; set; }
        public decimal EffectiveCapacity { get; set; }
        public decimal AverageStroage { get; set; }
        public string State { get; set; }
        public string AveragePercentage { get; set; }
        public int RankNo { get; set; }
    }

    public class ReservoirDataApplicationData
    {
        public string StationNo { get; set; }
        public DateTime Time { get; set; }
        public string Year
        {
            get
            {
                return Info_Time.ToString("yyyy");
            }
        }
        public string DateTimeStr
        {
            get
            {
                return Info_Time.ToString("yyyy-MM-dd");
            }
        }
        public string DateTimeMDStr
        {
            get
            {
                return Info_Time.ToString("MM-dd");
            }
        }
        public decimal? EffectiveCapacity { get; set; }
        public decimal? AccumulatedRainfall { get; set; }
        public decimal? InflowTotal { get; set; }
        public decimal? OutflowTotal { get; set; }
        public DateTime Info_Time { get; set; }
        public decimal? WaterHeight { get; set; }
        public decimal? EffectiveStorage { get; set; }
        public decimal? PercentageOfStorage { get; set; }
    }

    public class SameDayEffectiveStorageData : ReservoirData
    {
        public int Rank { get; set; }

    }

    public class GrandTotalData : ReservoirData
    {
        public DateTime EndDateTime { get; set; }
        public decimal? InflowTotal_SUM { get; set; }
        public decimal? AccumulatedRainfall_SUM { get; set; }
    }

    public class IARainfallAndReservoirSummary
    {
        public string IANo { get; set; }
        public string IAName { get; set; }
        public string ReservoirSTNo { get; set; }
        public string ReservoirGroupName { get; set; }
        public decimal? Pass1Month { get; set; }
        public decimal? Pass2Month { get; set; }
        public decimal? PassSUM { get; set; }
        public decimal? Now1Month { get; set; }
        public decimal? Now2Month { get; set; }
        public decimal? NowSUM { get; set; }
        public decimal? EffectiveCapacity { get; set; }
        public decimal? EffectiveStorage { get; set; }
        public decimal? PercentageOfStorage { get; set; }
        public decimal? EffectiveStorage_AVG { get; set; }
        public int? Rank { get; set; }
        public int? DataCount { get; set; }
    }


    #endregion
}
