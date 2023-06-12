using Dapper;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer;
using DBClassLibrary.UserDomainLayer.CWBModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class GridDataHelper : BaseRepository
    {
        #region 網格資料

        /// <summary>
        /// 取得日累積雨量觀測分析格點資料
        /// </summary>
        /// <param name="StartDate"></param>
        /// <param name="EndDate"></param>
        /// <returns></returns>
        public List<GridCumulativeDailyRainfallRaw> GetGridCumulativeDailyRainfallRaw(
            DateTime StartDate, DateTime EndDate)
        {
            string sqlStatement =
                @"SELECT        DataTime, RawData
                    FROM           tbl_GridCumulativeDailyRainfallRaw
                    WHERE        (DataTime BETWEEN @StartDate AND @EndDate)
                    ORDER BY  DataTime";

            var sqlParams = new
            {
                StartDate = StartDate,
                EndDate = EndDate,
            };

            var result = defaultDB.Query<GridCumulativeDailyRainfallRaw>(sqlStatement, sqlParams).ToList();
            return result;

        }

        /// <summary>
        /// 寫入邊界資料計算平均雨量
        /// </summary>
        /// <param name="DataList"></param>
        /// <returns></returns>
        public int InsertGridBoundaryRainfallRealTime(List<GridBoundaryRainfall> DataList)
        {
            string sql =
                @"INSERT        
                    INTO    tbl_GridBoundaryRainfallRealTime
                            (BoundaryID, BoundaryType, DataTime, Rain)
                    VALUES  (@BoundaryID, @BoundaryType, @DataTime, @Rain)";

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
        /// 取得即時網格資料, 依邊界資料計算平均雨量
        /// </summary>
        /// <param name="dataTime"></param>
        public List<GridBoundaryRainfall> ExecuteCalcBoundaryRainValue(
            DateTime dataTime, int GridSize, int BoundaryType)
        {
            var procedure = "[usp_CalcBoundaryRainValue]";
            var values = new { DataTime = dataTime, GridSize = GridSize, BoundaryType = BoundaryType };
            var results = defaultDB.Query<GridBoundaryRainfall>(procedure, values, commandType: CommandType.StoredProcedure).ToList();

            List<GridBoundaryRainfall> rainfalls = new List<GridBoundaryRainfall>();
            foreach (var item in results)
            {
                GridBoundaryRainfall rainfall = new GridBoundaryRainfall();
                rainfall.BoundaryID = item.BoundaryID;
                rainfall.Rain = item.Rain;
                //補充 BoundaryType, DataTime
                rainfall.BoundaryType = BoundaryType;
                rainfall.DataTime = dataTime;

                rainfalls.Add(rainfall);
            }

            return rainfalls;
        }

        #endregion 網格資料

        #region 加值計算

        /// <summary>
        /// 取今日雨量及昨日湛水深，算今日有效雨量(每日排程運算)
        /// </summary>
        /// <param name="dataTime"></param>
        /// <param name="BoundaryType"></param>
        /// <returns></returns>
        public List<GridEffectiveRainValue> ExecuteCalcEffectiveRainValue_Daily(
            DateTime dataTime, int BoundaryType)
        {
            var procedure = "[usp_CalcEffectiveRainValue_Daily]";
            var values = new { DataTime = dataTime, BoundaryType = BoundaryType };
            var results = defaultDB.Query<GridEffectiveRainValue>(procedure, values, commandType: CommandType.StoredProcedure).ToList();

            List<GridEffectiveRainValue> rainfalls = new List<GridEffectiveRainValue>();
            foreach (var item in results)
            {
                GridEffectiveRainValue rainfall = new GridEffectiveRainValue();
                rainfall.BoundaryID = item.BoundaryID;
                rainfall.BoundaryType = item.BoundaryType;
                rainfall.DataTime = item.DataTime;
                rainfall.Rain = item.Rain;
                rainfall.RainForStorage = item.RainForStorage;
                rainfall.WaterUsage = item.WaterUsage;
                rainfall.MaxWaterStorage = item.MaxWaterStorage;
                rainfall.WaterStorage = item.WaterStorage;
                rainfall.Drainage = item.Drainage;
                rainfall.EffectiveRainfall = item.EffectiveRainfall;
                rainfalls.Add(rainfall);
            }

            return rainfalls;
        }

        #endregion 加值計算

    }
}
