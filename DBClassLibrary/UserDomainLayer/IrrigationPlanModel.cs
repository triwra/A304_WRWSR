using System;

namespace DBClassLibrary.UserDomainLayer
{
    /// <summary>
    /// 灌溉用水資料
    /// </summary>
    public class IrrigationPlanModel
    {
        #region 查詢資料時使用
        /// <summary>
        /// 灌溉支線渠道資料
        /// </summary>
        public class YearList
        {
            public int Year { get; set; }
        }

        /// <summary>
        /// 灌溉支線渠道資料
        /// </summary>
        public class IrrigationCanalInfo
        {
            public string CanalID { get; set; }
            public string CanalName { get; set; }
            public string SysID { get; set; }
            public int? AreaID { get; set; }
            public int? GroupNo { get; set; }
        }

        /// <summary>
        /// 灌溉區域資料
        /// </summary>
        public class IrrigationAreaInfo
        {
            public string AreaID { get; set; }
            public string AreaName { get; set; }
        }

        /// <summary>
        /// 灌溉用水資料
        /// </summary>
        public class IrrigationPlanData
        {
            public DateTime PlanDate { get; set; }
            public DateTime Period1StartDate { get; set; }
            public DateTime Period2StartDate { get; set; }  
            public string DateStr
            {
                get
                {
                    return PlanDate.ToString("yyyy-MM-dd");
                }
            }
            public string Period1StartDateStr
            {
                get
                {
                    return Period1StartDate.ToString("yyyy-MM-dd");
                }
            }
            public string Period2StartDateStr
            {
                get
                {
                    return Period2StartDate.ToString("yyyy-MM-dd");
                }
            }
            public string CanalID { get; set; }
            public string CropType { get; set; }
            public int Irrig_Field { get; set; }
            public int PeriodNo { get; set; }
            public int CorpCount { get; set; }
            public int? CropGrowState { get; set; }
            public decimal? FieldArea { get; set; }
            public decimal? Rate { get; set; }
            public decimal? PlanField { get; set; }
            public decimal? PlanGate { get; set; }
            public decimal? PlanLoss { get; set; }
            public decimal? PlanTotal { get; set; }
            public decimal? ProofGate { get; set; }
            public decimal? ProofLoss { get; set; }
            public decimal? ProofTotal { get; set; }
            public decimal? RealGate { get; set; }
            public decimal? RealLoss { get; set; }
            public decimal? RealTotal { get; set; }
            public decimal? CanalAdiust { get; set; }
            public decimal? CanalAdiustDelt { get; set; }
        }

        /// <summary>
        /// 灌溉用水管理區代碼 
        /// </summary>
        public class IrrigationPlanManageInfo
        {
            public string ManageID { get; set; }
            public string ManageName { get; set; }
            public string SysID { get; set; }
            public int? AreaID { get; set; }
            public int? GroupNo { get; set; }
        }

        /// <summary>
        /// 灌溉用水計劃管理區資料
        /// </summary>
        public class IrrigationPlanManageData
        {
            public DateTime PlanDate { get; set; }
            public string ManageID { get; set; }
            public string CropType { get; set; }
            public int Irrig_Field { get; set; }
            public int PeriodNo { get; set; }
            public int CropCount { get; set; }
            public int DateCount { get; set; }
            public int? CropGrowState { get; set; }
            public decimal? FieldArea { get; set; }
            public decimal? Rate { get; set; }
            public decimal? PlanField { get; set; }
            public decimal? PlanTotal { get; set; }
            public decimal? ProofTotal { get; set; }
            public decimal? RealTotal { get; set; }
            public decimal? CanalAdiust { get; set; }
            public decimal? CanalAdiustDelt { get; set; }
        }

        /// <summary>
        /// 灌溉用水計劃管理區資料(依旬合計)
        /// </summary>
        public class IrrigationPlanManageDataByTendays
        {
            public string SystemName { get; set; }
            public string GroupNo { get; set; }

            public decimal? FieldArea { get; set; }
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

        #endregion 查詢資料時使用
    }

    public class DataSummary
    {
        public class IrrigData
        {
            public DateTime PlanDate { get; set; }
            public string DateStr
            {
                get
                {
                    return PlanDate.ToString("yyyy-MM-dd");
                }
            }
            public string MDDateStr
            {
                get
                {
                    return PlanDate.ToString("MM-dd");
                }
            }
            public decimal PlanTotal { get; set; }
            public int TenDayNo { get; set; }
        }

        public class PubicData
        {
            public DateTime DateTime { get; set; }
            public string DateStr
            {
                get
                {
                    return DateTime.ToString("yyyy-MM-dd");
                }
            }
            public string MDDateStr
            {
                get
                {
                    return DateTime.ToString("MM-dd");
                }
            }
            public decimal PlanTotal { get; set; }
            public decimal ProofTotal { get; set; }
            public decimal RealTotal { get; set; }
            public int TenDayNo { get; set; }
        }

        public class QInflowData {
            public DateTime DateTime { get; set; }
            public string DateStr
            {
                get
                {
                    return DateTime.ToString("yyyy-MM-dd");
                }
            }
            public string MDDateStr
            {
                get
                {
                    return DateTime.ToString("MM-dd");
                }
            }
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
            public decimal Inflow { get; set; }
            public int TenDayNo { get; set; }
        }

    }

    /// <summary>
    /// 民生公共及工業用水
    /// </summary>
    public class PublicUseOfWater
    {
        /// <summary>
        /// 民生公共及工業用水分類
        /// </summary>
        public enum SupplyType
        {
            Pub = 1,    //民生公共
            Ind = 2     //工業用水
        }

        public class PublicUseOfWaterData
        {
            public string StationNo { get; set; }
            
            public DateTime SupplyDate { get; set; }
            public string DateStr
            {
                get
                {
                    return SupplyDate.ToString("yyyy-MM-dd");
                }
            }
            public string SupplyType { get; set; }
            public decimal? PlanTotal { get; set; }
            public decimal? ProofTotal { get; set; }
            public decimal? RealTotal { get; set; }
            public decimal? CanalAdiust { get; set; }
            public decimal? CanalAdiustDelt { get; set; }
        }

    }

}
