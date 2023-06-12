using Dapper;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer.WraModel;
using System;
using System.Collections.Generic;
using static DBClassLibrary.UserDomainLayer.WraModel.GroundwaterLevelByYears;
using static DBClassLibrary.UserDomainLayer.WraModel.LivestockQuantityAndWaterConsumptionStatisticsForAgriculturalUsage;
using static DBClassLibrary.UserDomainLayer.WraModel.WaterConsumptionStatisticsForAgriculturalUsage;
using static DBClassLibrary.UserDomainLayer.WraModel.WaterConsumptionStatisticsForDomesticUsage;
using static DBClassLibrary.UserDomainLayer.WraModel.WaterSourceStatisticsForIndutrialUsage;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class WraDataHelper : BaseRepository
    {
        #region 河川

        /// <summary>
        /// 更新河川即時水位資料 (已存在的資料不寫入)
        /// </summary>
        /// <param name="DataList"></param>
        /// <returns></returns>
        public int InsertRiverWaterLevelRealTime(List<Realtimewaterlevel_OPENDATA> DataList)
        {
            string sql = @"INSERT INTO tbl_RiverWaterLevelRealTime
					        (RecordTime, StationIdentifier, WaterLevel)
					        SELECT       
					            @RecordTime, @StationIdentifier, @WaterLevel
                            WHERE NOT EXISTS 
                                (SELECT 1 FROM tbl_RiverWaterLevelRealTime 
                                    WHERE StationIdentifier = @StationIdentifier AND RecordTime = @RecordTime) ";

            int executeResult = 0;
            try
            {
                //依是否有使用 Transaction 進行不同的呼叫
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql, DataList);
                else
                    executeResult = defaultDB.Execute(sql, DataList, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }

        #endregion 河川

        #region 水庫

        /// <summary>
        /// 水庫每日營運狀況, 刪除同一日的資料(刪除已有資料)
        /// </summary>
        /// <param name="DataDate"></param>
        /// <param name="ST_NO"></param>
        /// <returns></returns>
        public int DelReservoirSummaryHistory(DateTime DataDate, string ST_NO)
        {

            string sql = @"DELETE FROM           tbl_wsReservoirSummaryHistory_wra
							WHERE        (RecordTime BETWEEN @StartDate AND @EndDate) 
                                        And ReservoirIdentifier = @ST_NO";

            DateTime StartDate = DataDate.Date;
            DateTime EndDate = DataDate.Date.AddDays(1).AddMinutes(-1);
            int executeResult = 0;
            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql,
                        new { StartDate = StartDate, EndDate = EndDate, ST_NO = ST_NO });
                else
                    executeResult = defaultDB.Execute(sql,
                        new { StartDate = StartDate, EndDate = EndDate, ST_NO = ST_NO }, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }

        /// <summary>
        /// 刪除 tbl_wsReservoirInfoHistory 除同一日的資料, 只保留最新一筆
        /// </summary> 
        public int DelReservoirInfoHistory(DateTime DataDate, string ST_NO)
        {

            string sql = @"DELETE FROM           tbl_wsReservoirInfoHistory_wra
							WHERE        (ObservationTime BETWEEN @StartDate AND @EndDate) 
                                        And ReservoirIdentifier = @ST_NO";

            DateTime StartDate = DataDate.Date;
            DateTime EndDate = DataDate.Date.AddDays(1).AddMinutes(-1);
            int executeResult = 0;
            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql,
                        new { StartDate = StartDate, EndDate = EndDate, ST_NO = ST_NO });
                else
                    executeResult = defaultDB.Execute(sql,
                        new { StartDate = StartDate, EndDate = EndDate, ST_NO = ST_NO }, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }

        #endregion 水庫

        #region 其他(地下水)

        /// <summary>
        /// 更新 地下水水位歷年統計 (已存在的資料不寫入)
        /// </summary>
        /// <param name="DataList"></param>
        /// <returns></returns>
        public int InsertGroundwaterLevelByYears(List<Historicalstatisticsofgroundwaterlevel_OPENDATA> DataList)
        {
            string sql =
                @"INSERT INTO tbl_GroundwaterLevelByYears
                     (Identifier, Year, AnnualAverageDailyWaterLevel, AnnualAverageDailyWaterLevelMark, HighestAnnualAverageDailyWaterLevel, 
                     HighestAnnualAverageDailyWaterLevelMark, HighestAnnualDailyAverageWaterLevel, HighestAnnualDailyAverageWaterLevelMark, 
                     HighestAnnualMomentWaterLevel, LowestAnnualAverageDailyWaterLevel, LowestAnnualAverageDailyWaterLevelMark, LowestAnnualDailyAverageWaterLevel, 
                     LowestAnnualDailyAverageWaterLevelMark, LowestAnnualMomentWaterLevel, OccurredDateOfHighestAnnualDailyAverageWaterLevel, 
                     OccurredDateOfLowestAnnualDailyAverageWaterLevel, OccurredTimeOfHighestAnnualMomentWaterLevel, OccurredTimeOfLowestAnnualMomentWaterLevel, 
                     OccurredYearOfHighestAnnualAverageDailyWaterLevel, OccurredYearOfLowestAnnualAverageDailyWaterLevel, YearsOfCompleteObservation, 
                     YearsOfObservation)
                  SELECT      @Identifier, @Year, @AnnualAverageDailyWaterLevel, @AnnualAverageDailyWaterLevelMark, @HighestAnnualAverageDailyWaterLevel
			                , @HighestAnnualAverageDailyWaterLevelMark, @HighestAnnualDailyAverageWaterLevel, @HighestAnnualDailyAverageWaterLevelMark
			                , @HighestAnnualMomentWaterLevel, @LowestAnnualAverageDailyWaterLevel, @LowestAnnualAverageDailyWaterLevelMark, @LowestAnnualDailyAverageWaterLevel
			                , @LowestAnnualDailyAverageWaterLevelMark, @LowestAnnualMomentWaterLevel, @OccurredDateOfHighestAnnualDailyAverageWaterLevel
			                , @OccurredDateOfLowestAnnualDailyAverageWaterLevel, @OccurredTimeOfHighestAnnualMomentWaterLevel, @OccurredTimeOfLowestAnnualMomentWaterLevel
			                , @OccurredYearOfHighestAnnualAverageDailyWaterLevel, @OccurredYearOfLowestAnnualAverageDailyWaterLevel, @YearsOfCompleteObservation
			                , @YearsOfObservation
                  WHERE NOT EXISTS 
                                (SELECT 1 FROM tbl_GroundwaterLevelByYears 
                                    WHERE Identifier = @Identifier AND Year = @Year) ";

            int executeResult = 0;
            try
            {
                //依是否有使用 Transaction 進行不同的呼叫
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql, DataList);
                else
                    executeResult = defaultDB.Execute(sql, DataList, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }

        #endregion 其他(地下水)

        #region 其他(用水資料)

        /// <summary>
        /// 更新 水利署工業用水量來源統計 (已存在的資料不寫入)
        /// </summary>
        /// <param name="DataList"></param>
        /// <returns></returns>
        public int InsertWaterSourceStatisticsForIndutrialUsage(            
            List<Waterresourcesagencywatersourcestatisticsforindutrialusage_OPENDATA> DataList)
        {
            string sql =
                @"INSERT INTO tbl_WaterSourceStatisticsForIndutrialUsage
                     (Area, Year, SerialNumber, SelfIntakeWaterConsumption, 
                        TapWaterConsumption, TotalWaterConsumption, Status)
                  SELECT      @Area, @Year, @SerialNumber, @SelfIntakeWaterConsumption, 
                              @TapWaterConsumption, @TotalWaterConsumption, @Status
                  WHERE NOT EXISTS 
                                (SELECT 1 FROM tbl_WaterSourceStatisticsForIndutrialUsage 
                                    WHERE Area = @Area 
                                          AND Year = @Year
                                          AND SerialNumber = @SerialNumber) ";

            int executeResult = 0;
            try
            {
                //依是否有使用 Transaction 進行不同的呼叫
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql, DataList);
                else
                    executeResult = defaultDB.Execute(sql, DataList, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }

        /// <summary>
        /// 更新 水利署生活用水量統計 (已存在的資料不寫入)
        /// </summary>
        /// <param name="DataList"></param>
        /// <returns></returns>
        public int InsertWaterSourceStatisticsForIndutrialUsage(
            List<Waterresourcesagencywaterconsumptionstatisticsfordomesticusage_OPENDATA> DataList)
        {
            string sql =
                @"INSERT INTO tbl_WaterConsumptionStatisticsForDomesticUsage
                     (Area, County, Year, SerialNumber, DistributedWaterQuantityPerPersonPerDay, DomesticWaterConsumptionPerPersonPerDay, SelfIntakePapulation, 
                     SelfIntakeWaterConsumption, SelfIntakeWaterConsumptionPerPersonPerDay, Status, TapWaterConsumption, TapWaterPopulation, TotalPopulation, 
                     WaterSalesPerPersonPerDay)
                  SELECT       @Area, @County, @Year, @SerialNumber, @DistributedWaterQuantityPerPersonPerDay, @DomesticWaterConsumptionPerPersonPerDay, @SelfIntakePapulation
			                 , @SelfIntakeWaterConsumption, @SelfIntakeWaterConsumptionPerPersonPerDay, @Status, @TapWaterConsumption, @TapWaterPopulation, @TotalPopulation
			                 , @WaterSalesPerPersonPerDay
                  WHERE NOT EXISTS 
                                (SELECT 1 FROM tbl_WaterConsumptionStatisticsForDomesticUsage 
                                    WHERE Area = @Area 
                                          AND Year = @Year
                                          AND County = @County
                                          AND SerialNumber = @SerialNumber) ";

            int executeResult = 0;
            try
            {
                //依是否有使用 Transaction 進行不同的呼叫
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql, DataList);
                else
                    executeResult = defaultDB.Execute(sql, DataList, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }

        /// <summary>
        /// 更新 水利署各項農業用水統計 (已存在的資料不寫入)
        /// </summary>
        /// <param name="DataList"></param>
        /// <returns></returns>
        public int InsertWaterConsumptionStatisticsForAgriculturalUsage(
            List<Waterresourcesagencywaterconsumptionstatisticsforagriculturalusage_OPENDATA> DataList)
        {
            string sql =
                @"INSERT INTO tbl_WaterConsumptionStatisticsForAgriculturalUsage
                     (Year, SerialNumber, CentralDistrictAnimalHusbandryWaterConsumption, CentralDistrictCultivationWaterConsumption, CentralDistrictIrrigationWaterConsumption, 
                     EastDistrictAnimalHusbandryWaterConsumption, EastDistrictCultivationWaterConsumption, EastDistrictIrrigationWaterConsumption, 
                     NorthDistrictAnimalHusbandryWaterConsumption, NorthDistrictCultivationWaterConsumption, NorthDistrictIrrigationWaterConsumption, 
                     SouthDistrictAnimalHusbandryWaterConsumption, SouthDistrictCultivationWaterConsumption, SouthDistrictIrrigationWaterConsumption, Status)
                  SELECT    @Year, @SerialNumber, @CentralDistrictAnimalHusbandryWaterConsumption, @CentralDistrictCultivationWaterConsumption, 
			                @CentralDistrictIrrigationWaterConsumption, 
			                @EastDistrictAnimalHusbandryWaterConsumption, @EastDistrictCultivationWaterConsumption, @EastDistrictIrrigationWaterConsumption, 
			                @NorthDistrictAnimalHusbandryWaterConsumption, @NorthDistrictCultivationWaterConsumption, @NorthDistrictIrrigationWaterConsumption, 
			                @SouthDistrictAnimalHusbandryWaterConsumption, @SouthDistrictCultivationWaterConsumption, @SouthDistrictIrrigationWaterConsumption, @Status
                  WHERE NOT EXISTS 
                                (SELECT 1 FROM tbl_WaterConsumptionStatisticsForAgriculturalUsage 
                                    WHERE Year = @Year
                                          AND SerialNumber = @SerialNumber) ";

            int executeResult = 0;
            try
            {
                //依是否有使用 Transaction 進行不同的呼叫
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql, DataList);
                else
                    executeResult = defaultDB.Execute(sql, DataList, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }

        /// <summary>
        /// 更新 水利署畜牧數與畜牧用水量統計 (已存在的資料不寫入)
        /// </summary>
        /// <param name="DataList"></param>
        /// <returns></returns>
        public int InsertLivestockQuantityAndWaterConsumptionStatisticsForAgriculturalUsage(
            List<Waterresourcesagencylivestockquantityandwaterconsumptionstatisticsforagriculturalusage_OPENDATA> DataList)
        {
            string sql =
                @"INSERT INTO tbl_LivestockQuantityAndWaterConsumptionStatisticsForAgriculturalUsage
                     (Area, County, Year, SerialNumber, AnimalHusbandryKind, LivestockQuantity, 
                      WaterConsumption, Status)
                  SELECT        @Area, @County, @Year, @SerialNumber, @AnimalHusbandryKind, 
                                @LivestockQuantity, @WaterConsumption, @Status
                  WHERE NOT EXISTS 
                                (SELECT 1 FROM tbl_LivestockQuantityAndWaterConsumptionStatisticsForAgriculturalUsage 
                                    WHERE 
                                        Area = @Area
                                        AND County = @County
                                        AND Year = @Year
                                        AND SerialNumber = @SerialNumber) ";

            int executeResult = 0;
            try
            {
                //依是否有使用 Transaction 進行不同的呼叫
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql, DataList);
                else
                    executeResult = defaultDB.Execute(sql, DataList, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }



        #endregion 其他(用水資料)

    }
}
