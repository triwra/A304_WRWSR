using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBClassLibrary.UserDomainLayer.WraModel
{
    public class WraModel
    {
    }

    #region 河川

    /// <summary>
    /// 河川即時水位資料
    /// </summary>
    public class RealTimeRiverWaterLevel
    {
        public Realtimewaterlevel_OPENDATA[] RealtimeWaterLevel_OPENDATA { get; set; }
    }

    public class Realtimewaterlevel_OPENDATA
    {
        public DateTime RecordTime { get; set; }
        public string StationIdentifier { get; set; }
        public string WaterLevel { get; set; }
    }

    #endregion 河川

    #region 水庫

    #region 水庫基本資料
    public class ReservoirStations
    {
        public Taiwanwaterexchangingdata TaiwanWaterExchangingData { get; set; }
    }

    public class Taiwanwaterexchangingdata
    {
        public string xmlns { get; set; }
        public string xmlnsgml { get; set; }
        public string xmlnstwed { get; set; }
        public Reservoirclass ReservoirClass { get; set; }
    }

    public class Reservoirclass
    {
        public Reservoirsinformation[] ReservoirsInformation { get; set; }
    }

    public class Reservoirsinformation
    {
        public string AgencyCode { get; set; }
        public string AgencyName { get; set; }
        public string Application { get; set; }
        public string Area { get; set; }
        public decimal CurruntCapacity { get; set; }
        public decimal CurruntEffectiveCapacity { get; set; }
        public decimal DesignedCapacity { get; set; }
        public string DesignedEffectiveCapacity { get; set; }
        public decimal DrainageArea { get; set; }
        public decimal FullWaterLevelArea { get; set; }
        public decimal Height { get; set; }
        public decimal Length { get; set; }
        public string ReservoirIdentifier { get; set; }
        public string ReservoirName { get; set; }
        public string RiverCode { get; set; }
        public string RiverName { get; set; }
        public decimal TheLastestMeasuredTimeOfReservoirCapacity { get; set; }
        public string TownName { get; set; }
        public string Type { get; set; }
        public int Year { get; set; }
    }


    #endregion 水庫基本資料

    #region 水庫水情資料
    public class ReservoirInfo
    {
        public Reservoirconditiondata_OPENDATA[] ReservoirConditionData_OPENDATA { get; set; }
    }

    public class Reservoirconditiondata_OPENDATA
    {
        public decimal? AccumulateRainfallInCatchment { get; set; }
        public decimal? DesiltingTunnelOutflow { get; set; }
        public decimal? DrainageTunnelOutflow { get; set; }
        public decimal? EffectiveWaterStorageCapacity { get; set; }
        public decimal? InflowDischarge { get; set; }
        public DateTime ObservationTime { get; set; }
        public decimal? OthersOutflow { get; set; }
        public decimal? PowerOutletOutflow { get; set; }
        public decimal? PredeterminedCrossFlow { get; set; }
        public DateTime? PredeterminedOutflowTime { get; set; }
        public string ReservoirIdentifier { get; set; }
        public decimal? SpillwayOutflow { get; set; }
        public int? StatusType { get; set; }
        public decimal? TotalOutflow { get; set; }
        public decimal? WaterDraw { get; set; }
        public decimal? WaterLevel { get; set; }
    }

    #endregion 水庫水情資料

    #region 水庫每日營運狀況

    public class ReservoirSummary
    {
        public Dailyoperationalstatisticsofreservoirs_OPENDATA[] DailyOperationalStatisticsOfReservoirs_OPENDATA { get; set; }
    }

    public class Dailyoperationalstatisticsofreservoirs_OPENDATA
    {
        public decimal? CatchmentAreaRainfall { get; set; }
        public decimal? CrossFlow { get; set; }
        public decimal? DeadStorageLevel { get; set; }
        public decimal? EffectiveCapacity { get; set; }
        public decimal? FullWaterLevel { get; set; }
        public decimal? InflowVolume { get; set; }
        public decimal? Outflow { get; set; }
        public decimal? OutflowDischarge { get; set; }
        public decimal? OutflowTotal { get; set; }
        public DateTime RecordTime { get; set; }
        public decimal? RegulatoryDischarge { get; set; }
        public string ReservoirIdentifier { get; set; }
        public string ReservoirName { get; set; }
    }

    #endregion 水庫每日營運狀況

    #endregion 水庫

    #region 其他(地下水)

    #region 地下水水位歷年統計

    public class GroundwaterLevelByYears
    {
        public class Rootobject
        {
            public Historicalstatisticsofgroundwaterlevel_OPENDATA[] HistoricalStatisticsOfGroundwaterLevel_OPENDATA { get; set; }
        }

        public class Historicalstatisticsofgroundwaterlevel_OPENDATA
        {

            public string Identifier { get; set; }
            public string Year { get; set; }

            public decimal? AnnualAverageDailyWaterLevel { get; set; }
            public string AnnualAverageDailyWaterLevelMark { get; set; }
            public decimal? HighestAnnualAverageDailyWaterLevel { get; set; }
            public string HighestAnnualAverageDailyWaterLevelMark { get; set; }
            public decimal? HighestAnnualDailyAverageWaterLevel { get; set; }
            public string HighestAnnualDailyAverageWaterLevelMark { get; set; }
            public decimal? HighestAnnualMomentWaterLevel { get; set; }

            public decimal? LowestAnnualAverageDailyWaterLevel { get; set; }
            public string LowestAnnualAverageDailyWaterLevelMark { get; set; }
            public decimal? LowestAnnualDailyAverageWaterLevel { get; set; }
            public string LowestAnnualDailyAverageWaterLevelMark { get; set; }
            public decimal? LowestAnnualMomentWaterLevel { get; set; }

            public string OccurredDateOfHighestAnnualDailyAverageWaterLevel { get; set; }
            public string OccurredDateOfLowestAnnualDailyAverageWaterLevel { get; set; }
            public string OccurredTimeOfHighestAnnualMomentWaterLevel { get; set; }
            public string OccurredTimeOfLowestAnnualMomentWaterLevel { get; set; }

            public int? OccurredYearOfHighestAnnualAverageDailyWaterLevel { get; set; }
            public int? OccurredYearOfLowestAnnualAverageDailyWaterLevel { get; set; }
            public int? YearsOfCompleteObservation { get; set; }
            public int? YearsOfObservation { get; set; }
        }

    }

    #endregion 地下水水位歷年統計

    #endregion 其他(地下水)

    #region 其他(用水資料)

    #region 水利署工業用水量來源統計

    public class WaterSourceStatisticsForIndutrialUsage
    {
        public class Rootobject
        {
            public Waterresourcesagencywatersourcestatisticsforindutrialusage_OPENDATA[] WaterResourcesAgencyWaterSourceStatisticsForIndutrialUsage_OPENDATA { get; set; }
        }

        public class Waterresourcesagencywatersourcestatisticsforindutrialusage_OPENDATA
        {
            public int Area { get; set; }
            public int Year { get; set; }
            public int SerialNumber { get; set; }
            public decimal? SelfIntakeWaterConsumption { get; set; }
            public decimal? TapWaterConsumption { get; set; }
            public decimal? TotalWaterConsumption { get; set; }
            public int Status { get; set; }
        }
    }

    #endregion 水利署工業用水量來源統計

    #region 水利署生活用水量統計
    public class WaterConsumptionStatisticsForDomesticUsage
    {
        public class Rootobject
        {
            public Waterresourcesagencywaterconsumptionstatisticsfordomesticusage_OPENDATA[] WaterResourcesAgencyWaterConsumptionStatisticsForDomesticUsage_OPENDATA { get; set; }
        }

        public class Waterresourcesagencywaterconsumptionstatisticsfordomesticusage_OPENDATA
        {
            public int Area { get; set; }
            public int County { get; set; }
            public int Year { get; set; }
            public int SerialNumber { get; set; }
            public decimal? DistributedWaterQuantityPerPersonPerDay { get; set; }
            public decimal? DomesticWaterConsumptionPerPersonPerDay { get; set; }
            public decimal? SelfIntakePapulation { get; set; }
            public decimal? SelfIntakeWaterConsumption { get; set; }
            public decimal? SelfIntakeWaterConsumptionPerPersonPerDay { get; set; }
            public int Status { get; set; }
            public decimal? TapWaterConsumption { get; set; }
            public decimal? TapWaterPopulation { get; set; }
            public decimal? TotalPopulation { get; set; }
            public decimal? WaterSalesPerPersonPerDay { get; set; }

        }
    }

    #endregion 水利署生活用水量統計

    #region 水利署各項農業用水統計

    public class WaterConsumptionStatisticsForAgriculturalUsage
    {
        public class Rootobject
        {
            public Waterresourcesagencywaterconsumptionstatisticsforagriculturalusage_OPENDATA[] WaterResourcesAgencyWaterConsumptionStatisticsForAgriculturalUsage_OPENDATA { get; set; }
        }

        public class Waterresourcesagencywaterconsumptionstatisticsforagriculturalusage_OPENDATA
        {
            public int Year { get; set; }
            public int SerialNumber { get; set; }
            public decimal? CentralDistrictAnimalHusbandryWaterConsumption { get; set; }
            public decimal? CentralDistrictCultivationWaterConsumption { get; set; }
            public decimal? CentralDistrictIrrigationWaterConsumption { get; set; }
            public decimal? EastDistrictAnimalHusbandryWaterConsumption { get; set; }
            public decimal? EastDistrictCultivationWaterConsumption { get; set; }
            public decimal? EastDistrictIrrigationWaterConsumption { get; set; }
            public decimal? NorthDistrictAnimalHusbandryWaterConsumption { get; set; }
            public decimal? NorthDistrictCultivationWaterConsumption { get; set; }
            public decimal? NorthDistrictIrrigationWaterConsumption { get; set; }
            public decimal? SouthDistrictAnimalHusbandryWaterConsumption { get; set; }
            public decimal? SouthDistrictCultivationWaterConsumption { get; set; }
            public decimal? SouthDistrictIrrigationWaterConsumption { get; set; }
            public int Status { get; set; }

        }
    }

    #endregion 水利署各項農業用水統計

    #region 水利署畜牧數與畜牧用水量統計

    public class LivestockQuantityAndWaterConsumptionStatisticsForAgriculturalUsage
    {
        public class Rootobject
        {
            public Waterresourcesagencylivestockquantityandwaterconsumptionstatisticsforagriculturalusage_OPENDATA[] WaterResourcesAgencyLivestockQuantityAndWaterConsumptionStatisticsForAgriculturalUsage_OPENDATA { get; set; }
        }

        public class Waterresourcesagencylivestockquantityandwaterconsumptionstatisticsforagriculturalusage_OPENDATA
        {
            public int Area { get; set; }
            public int County { get; set; }
            public int Year { get; set; }
            public int SerialNumber { get; set; }

            public int AnimalHusbandryKind { get; set; }
            public decimal LivestockQuantity { get; set; }
            public decimal WaterConsumption { get; set; }
            public int Status { get; set; }

        }
    }
    #endregion 水利署畜牧數與畜牧用水量統計

    #region 用水計畫摘要表

    public class AbstractOfWaterUsagePlan
    {
        public class Rootobject
        {
            public Abstractofwaterusageplan_OPENDATA[] AbstractOfWaterUsagePlan_OPENDATA { get; set; }
        }

        public class Abstractofwaterusageplan_OPENDATA
        {
            public string DevelopmentFactory { get; set; }
            public string PlanCode { get; set; }
            public string PlanName { get; set; }
            public decimal PlannedAverageDailyWaterRequiredQuantity { get; set; }
        }
    }

    #endregion 用水計畫摘要表

    #endregion 其他(用水資料)

}
