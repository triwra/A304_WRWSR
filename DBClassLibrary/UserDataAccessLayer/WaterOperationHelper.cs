using Dapper;
using System;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer.WaterOperationModel;
using System.Collections.Generic;
using System.Linq;
using DBClassLibrary.UserDomainLayer.UserInterfaceModel;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class WaterOperationHelper : BaseRepository
    {
        /// <summary>
        /// 回傳單一水庫即時資料
        /// </summary>
        /// <param name="StationNo"></param>
        /// <returns></returns>
        public List<WaterOperationData> GetWaterOperationData(int AllowedAmount, string IrrZone)
        {
            string sqlStatement =
                @"select IrrigationZone, NName, Cast(Round(sum(Shortage),1) as decimal(10,1)) as WaterShortage, 
                    Cast(Round(sum(Shortage)/sum(Demand)*100,0) as INT) as WaterDemandRate,
                    sum(Demand) as WaterDemand, Replace(NName, '灌區','') as shortname
                    from [tbl_IrrigationArrangeSimulatedShortage]
                    where cast(AllowedAmount as int)=@AllowedAmount
                    group by IrrigationZone, NName,NOrder 
                    order by NOrder desc
                    ";

      
            var result = defaultDB.Query<WaterOperationData>(sqlStatement, new { AllowedAmount = AllowedAmount });

            return result.ToList();
        }

        public List<WaterOperationChartData> WaterOperationChartData(int AllowedAmount, string IrrZone)
        {
            string sqlStatement =
                @"select IrrigationZone, NName,AllowedAmount, PeriodofYear, Shortage, Demand from 
                    [tbl_IrrigationArrangeSimulatedShortage]
                    where nname=@IrrZone and AllowedAmount=@AllowedAmount
                    order by PeriodofYear";


            var result = defaultDB.Query<WaterOperationChartData>(sqlStatement, new { IrrZone= IrrZone, AllowedAmount= AllowedAmount });

            return result.ToList();
        }

        public List<WaterAmountListData> GetWaterAmountList(string IrrigationZone)
        {
            string sqlStatement =
                @"select distinct CAST(AllowedAmount as INT)  as AmountWater
                    from [tbl_IrrigationArrangeSimulatedShortage]
                    where  IrrigationZone=@IrrigationZone
                    order by CAST(AllowedAmount as INT)";


            var result = defaultDB.Query<WaterAmountListData>(sqlStatement, new { IrrigationZone = IrrigationZone });

            return result.ToList();
        }

        #region 供灌缺水風險評估

        /// <summary>
        /// 有定義缺水風險值的水庫名單
        /// </summary>
        /// <returns></returns>
        public List<SelectOption> GetHasRiskReservoirList()
        {
            string sqlStatement =
                @"
                    SELECT        R.StationNo as Value, F.StationName as Name
                    FROM           tbl_ReservoirInflowToRisk AS R INNER JOIN
                                         tbl_wsReservoirStations_fhy AS F ON R.StationNo = F.StationNo
                    GROUP BY  R.StationNo, F.StationName
                    Order By R.StationNo
                ";
            var result = defaultDB.Query<SelectOption>(sqlStatement);

            return result.ToList();
        }

        /// <summary>
        /// 計算供灌缺水風險評估值
        /// </summary>
        /// <param name="StationNo"></param>
        /// <param name="S0">初始蓄水量</param>
        /// <param name="StartDate"></param>
        /// <param name="EndDate"></param>
        /// <returns></returns>
        public List<ReservoirInflowToRisk> GetReservoirInflowToRisk(
            string StationNo, int S0, DateTime StartDate, DateTime EndDate)
        {
            //GetArea = (InflowTotal + S0 
            int D = 15000;
            int U = 1;

            string sqlStatement =
                @"
                    SELECT StationNo, StartDate, EndDate, InflowTotal, Risk, 
                             ROUND(Risk * 100, 1) AS GetRisk, 
                             (InflowTotal + @S0 - @D) / @U AS GetArea
                    FROM     tbl_ReservoirInflowToRisk
                    WHERE        
                            StationNo = @StationNo 
                            AND StartDate = @StartDate 
                            AND EndDate = @EndDate
                            AND ((InflowTotal + @S0 - @D) / @U) < 40000
                    Order By GetArea
                ";
            var result = defaultDB.Query<ReservoirInflowToRisk>(
                sqlStatement,
                new
                {
                    StationNo = StationNo,
                    StartDate = StartDate,
                    EndDate = EndDate,
                    S0 = S0,
                    D = D,
                    U = U
                });

            return result.ToList();
        }


        #endregion 供灌缺水風險評估


    }
}
