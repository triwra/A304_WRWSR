using Dapper;
using System;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer;
using DBClassLibrary.UserDomainLayer.ReservoirModel;
using System.Collections.Generic;
using System.Linq;
using PiField = DBClassLibrary.UserDomainLayer.ReservoirModel.PiField;
using PiType = DBClassLibrary.UserDomainLayer.ReservoirModel.PiType;
using DBClassLibrary.UserDomainLayer.FhyAPIModel;
using ReservoirInfo = DBClassLibrary.UserDomainLayer.ReservoirModel.ReservoirInfo;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class ReservoirHelper : BaseRepository
    {
        /// <summary>
        /// 回傳單一水庫即時資料
        /// </summary>
        /// <param name="StationNo"></param>
        /// <returns></returns>
        public ReservoirInfoData GetLatestReservoirInfo(string StationNo)
        {
            string sqlStatement =
                @"SELECT
                        R.StationNo, R.Time, R.AccumulatedRainfall, R.WaterHeight, 
                        R.EffectiveCapacity, R.EffectiveStorage, R.PercentageOfStorage, R.OperationalStorage, R.Inflow, 
                        R.Outflow, R.Status, R.NextSpillTime, R.Discharge, R.DischargeOfProtectionFlood, R.DischargeOfEscapeSand, 
                        R.DischargeOfHydroelectric, R.DischargeOfOthers, 
                        S.StationName
                    FROM           tbl_wsReservoirInfo_fhy AS R INNER JOIN
                                         tbl_wsReservoirStations_fhy AS S ON R.StationNo = S.StationNo
                    WHERE        (R.StationNo = @StationNo)
                    ORDER BY  R.Time DESC";

            var sqlParams = new
            {
                StationNo = StationNo
            };

            var result = defaultDB.Query<ReservoirInfoData>(sqlStatement, sqlParams).FirstOrDefault();

            return result;
        }


        #region 超越機率 計算

        /// <summary>
        /// 取得資料期間的(某時間段)的水庫超越機率(用加總或平均的值計算)
        /// </summary>
        /// <param name="StartDate">資料開始期間</param>
        /// <param name="EndDate">資料結束期間</param>
        /// <param name="DataStartDay">計算開始日</param>
        /// <param name="DataEndDay">計算結束日</param>
        /// <param name="piType">計算週期種類</param>
        /// <param name="piField">計算時的採用值種類</param>
        /// <param name="StationNo">水庫編號</param>
        /// <returns></returns>
        public List<RservoirItemValuePi> GetResvoirSummeryPiByPeroid(
            DateTime StartDate, DateTime EndDate,
            DateTime DataStartDate, DateTime DataEndDate,
            PiType piType, PiField piField, string TargetTableName, string[] StationNo)
        {
            string sqlStatement =
                string.Format(@"
	            Declare @N as int
				SELECT @N = count(1)
				From (
					SELECT DataTypeValueDate
					From {0}
					Where 
						{1} > 0
						AND (StationNo IN @StationNo)
						AND DataTypeValueDate Between @StartDate AND @EndDate
						AND DATEPART(MONTH, DataTypeValueDate) = @DataStartMonth 
						AND DATEPART(Day, DataTypeValueDate) = @DataStartDay
                        AND DataType = @DataType
					GROUP BY DataTypeValueDate) as tbl_Count

                SELECT   DataTypeValueDate,
		            SUM({1}) as ItemValue,
                    ROW_NUMBER() OVER(ORDER BY SUM({1}) Desc) AS SortFlag,
		            Cast( ROW_NUMBER() OVER(ORDER BY SUM({1}) Desc) / cast(@N+1 as decimal(8,4)) as decimal(8,4)) as Pi
	                From {0}
	            Where 
		            {1} > 0
					AND (StationNo IN @StationNo)
					AND DataTypeValueDate Between @StartDate AND @EndDate
					AND DATEPART(MONTH, DataTypeValueDate) = @DataStartMonth 
					AND DATEPART(Day, DataTypeValueDate) = @DataStartDay
                    AND DataType = @DataType
				GROUP BY DataTypeValueDate", TargetTableName, piField.ToString());

            var result = defaultDB.Query<RservoirItemValuePi>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate,

                    DataStartMonth = DataStartDate.Month,
                    DataStartDay = DataStartDate.Day,

                    DataType = piType.ToString(),
                    StationNo = StationNo
                });

            return result.ToList();
        }

        /// <summary>
        /// 刪除原有的計算值
        /// </summary>
        /// <param name="StartDate"></param>
        /// <param name="EndDate"></param>
        /// <returns></returns>
        public int DeleteReservoirPiValue(DateTime StartDate, DateTime EndDate,
            string StationNo, string piType, string piField)
        {
            string sql = @"DELETE FROM tbl_GridBoundaryPiValue
                            WHERE        
                                (StationNo = @StationNo) 
                                AND (StartDate = @StartDate) 
                                AND (EndDate = @EndDate) 
                                AND (PiType = @piType)
                                AND (PiField = @piField)
                          ";

            int executeResult = 0;
            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql,
                        new
                        {
                            StartDate = StartDate,
                            EndDate = EndDate,
                            StationNo = StationNo,
                            piType = piType,
                            piField = piField
                        });
                else
                    executeResult = defaultDB.Execute(sql,
                        new
                        {
                            StartDate = StartDate,
                            EndDate = EndDate,
                            StationNo = StationNo,
                            piType = piType,
                            piField = piField
                        }, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }

            return executeResult;
        }

        /// <summary>
        /// 取得資料期間的(某時間段)的水庫超越機率(用每日的值計算)(己不使用)
        /// </summary>
        /// <param name="StartDate">資料開始期間</param>
        /// <param name="EndDate">資料結束期間</param>
        /// <param name="DataStartDay">計算開始日</param>
        /// <param name="DataEndDay">計算結束日</param>
        /// <param name="piType">計算週期種類</param>
        /// <param name="piField">計算時的採用值種類</param>
        /// <param name="StationNo">水庫編號</param>
        /// <returns></returns>
        public List<RservoirItemValuePi> GetResvoirPiByPeroid(
            DateTime StartDate, DateTime EndDate,
            DateTime DataStartDate, DateTime DataEndDate,
            PiType piType, PiField piField, string[] StationNo)
        {
            string strSqlCondition = string.Empty;
            if (piType == PiType.Year)
                strSqlCondition = " AND DATEPART(Year, DataTime) = @Year ";

            //若 DataStartDate 及 DataEndDate 的間隔
            //為一日則為計算日, 相差一個月則為計算月, 相差10天為旬
            string sqlStatement =
                string.Format(@"
	            Declare @N as int
				SELECT @N = count(1)
				From (
					SELECT DataTime
					From vwReservoirAllData
					Where 
						{1} > 0
						AND (StationNo IN @StationNo)
						AND DataTime Between @StartDate AND @EndDate
                        {0}
						AND DATEPART(MONTH, DataTime) Between @DataStartMonth And @DataEndMonth
						AND DATEPART(Day, DataTime) Between @DataStartDay And @DataEndDay
					GROUP BY DataTime) as tbl_Count

                SELECT   DataTime,
		            SUM({1}) as ItemValue,
                    ROW_NUMBER() OVER(ORDER BY SUM({1}) Desc) AS SortFlag,
		            Cast( ROW_NUMBER() OVER(ORDER BY SUM({1}) Desc) / cast(@N+1 as decimal(8,4)) as decimal(8,4)) as Pi
	                From vwReservoirAllData
	            Where 
		            {1} > 0
						AND (StationNo IN @StationNo)
						AND DataTime Between @StartDate AND @EndDate
                        {0}
						AND DATEPART(MONTH, DataTime) Between @DataStartMonth And @DataEndMonth
						AND DATEPART(Day, DataTime) Between @DataStartDay And @DataEndDay
				GROUP BY DataTime", strSqlCondition, piField.ToString());

            var result = defaultDB.Query<RservoirItemValuePi>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate,
                    Year = DataStartDate.Year,
                    DataStartMonth = DataStartDate.Month,
                    DataEndMonth = DataEndDate.Month,
                    DataStartDay = DataStartDate.Day,
                    DataEndDay = DataEndDate.Day,
                    StationNo = StationNo
                });

            return result.ToList();
        }


        #endregion 超越機率 計算

        #region 計算水庫各項數值的總和及平圴值

        /// <summary>
        /// 計算水庫各項數值的總和及平圴值
        /// </summary>
        /// <param name="StartDate"></param>
        /// <param name="EndDate"></param>
        /// <param name="StationNo"></param>
        /// <returns></returns>
        public ReservoirSummaryValue GetResvoirSummaryByPeriod(DateTime StartDate, DateTime EndDate, string StationNo)
        {
            string sqlStatement =
                @"
            SELECT        StationNo
	            ,SUM(CASE WHEN EffectiveStorage >= 0 THEN EffectiveStorage Else 0 END) as EffectiveStorageTotal
	            ,0 as EffectiveStorageAverage
	            ,SUM(CASE WHEN EffectiveStorage >= 0 THEN 1 Else 0 END) as EffectiveStorageCount
	            ,SUM(CASE WHEN EffectiveStorage < 0 OR EffectiveStorage IS NULL THEN 1 Else 0 END) as EffectiveStorageMissCount

	            ,SUM(CASE WHEN AccumulatedRainfall >= 0 THEN AccumulatedRainfall Else 0 END) as AccumulatedRainfallTotal
	            ,0 as AccumulatedRainfallAverage
	            ,SUM(CASE WHEN AccumulatedRainfall >= 0 THEN 1 Else 0 END) as AccumulatedRainfallCount
	            ,SUM(CASE WHEN AccumulatedRainfall < 0 OR AccumulatedRainfall IS NULL THEN 1 Else 0 END) as AccumulatedRainfallMissCount

	            ,SUM(CASE WHEN InflowTotal >= 0 THEN InflowTotal Else 0 END) as InflowTotal
	            ,0 as InflowAverage
	            ,SUM(CASE WHEN InflowTotal >= 0 THEN 1 Else 0 END) as InflowCount
	            ,SUM(CASE WHEN InflowTotal < 0 OR InflowTotal IS NULL THEN 1 Else 0 END) as InflowMissCount

	            ,SUM(CASE WHEN OutflowTotal >= 0 THEN OutflowTotal Else 0 END) as OutflowTotal	
	            ,0 as OutflowAverage
	            ,SUM(CASE WHEN OutflowTotal >= 0 THEN 1 Else 0 END) as OutflowCount
	            ,SUM(CASE WHEN OutflowTotal < 0 OR OutflowTotal IS NULL THEN 1 Else 0 END) as OutflowMissCount

            FROM           vwReservoirAllData
            WHERE        
                (StationNo = @StationNo) 
                AND (DataTime BETWEEN @StartDate AND @EndDate) 
                Group BY StationNo
                    ";

            var result = defaultDB.Query<ReservoirSummaryValue>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate,
                    StationNo = StationNo
                }).FirstOrDefault();

            return result;
        }

        /// <summary>
        /// 刪除原有的計算值
        /// </summary>
        /// <returns></returns>
        public int DeleteReservoirSummaryValue(string StationNo, string DataType, DateTime DataTypeValueDate)
        {
            string sql = @"DELETE FROM tbl_ReservoirDataSummary
                            WHERE        
                            (StationNo = @StationNo) 
                            AND (DataType = @DataType) 
                            AND (DataTypeValueDate = @DataTypeValueDate)";

            int executeResult = 0;
            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql,
                        new
                        {
                            StationNo = StationNo,
                            DataType = DataType,
                            DataTypeValueDate = DataTypeValueDate
                        });
                else
                    executeResult = defaultDB.Execute(sql,
                        new
                        {
                            StationNo = StationNo,
                            DataType = DataType,
                            DataTypeValueDate = DataTypeValueDate
                        }, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }

            return executeResult;
        }

        #endregion 計算水庫各項數值的總和及平圴值

        #region 查詢水庫資料

        /// <summary>
        /// 依水庫編號取得超越機率的採用值
        /// </summary>
        /// <param name="StationNo"></param>
        /// <param name="piType"></param>
        /// <param name="piField"></param>
        /// <param name="StartDate"></param>
        /// <param name="EndDate"></param>
        /// <returns></returns>
        public List<ReservoirPiValue> GetReservoirPiValue(
            string StationNo, PiType piType,
            PiField piField = PiField.InflowTotal,
            string StartDate = "1974-01-01", string EndDate = "2019-12-31")
        {
            string sqlStatement =
                @"
                    SELECT *
                    FROM tbl_ReservoirPiValue
                    WHERE
                            StationNo = @StationNo 
                        AND StartDate = @StartDate
                        AND EndDate = @EndDate
                        AND PiType = @PiType
                        AND PiField = @PiField
                ";
            var result = defaultDB.Query<ReservoirPiValue>(sqlStatement,
                new
                {
                    StationNo = StationNo,
                    StartDate = StartDate,
                    EndDate = EndDate,
                    PiType = piType.ToString(),
                    PiField = piField.ToString(),
                });

            return result.ToList();
        }


        /// <summary>
        /// 水庫各項數值的總和及平圴值(依指定欄位排名)
        /// </summary>
        /// <param name="StationNo"></param>
        /// <param name="summaryType">計算週期種類</param>
        /// <param name="summarySortType">歷年排名方式</param>
        /// <param name="DataTypeValue">指定某個特定的值(如:某個月)</param>
        /// <param name="StartDate">歷年的開始時間,預設為1974/01/01</param>
        /// <param name="EndDate">歷年的結束時間,預設為當日</param>
        /// <returns></returns>
        public List<ReservoirSummaryValue> QueryResvoirSummaryByPeriod(
            string[] StationNo, UserDomainLayer.ReservoirModel.SummaryType summaryType, UserDomainLayer.ReservoirModel.SummarySortType summarySortType,
            int DataTypeValue = 0, DateTime StartDate = default(DateTime), DateTime EndDate = default(DateTime))
        {
            //是否指定某個特定的值(如:某個月)
            string strDataTypeValueCondition = string.Empty;
            if (DataTypeValue != 0)
                strDataTypeValueCondition = " AND (DataTypeValue = @DataTypeValue) ";
            //處理預設的期間
            if (StartDate == DateTime.MinValue) StartDate = Convert.ToDateTime("1974/01/01");
            if (EndDate == DateTime.MinValue) EndDate = DateTime.Now;

            string sqlStatement =
                string.Format(@"

	            SELECT        DataType, DataTypeValueDate, DataTypeValue, 
					            SUM(EffectiveStorageTotal) AS EffectiveStorageTotal, 
					            --SUM(EffectiveStorageTotal) / SUM(EffectiveStorageCount) AS EffectiveStorageAverage,
					            SUM(EffectiveStorageCount) AS EffectiveStorageCount, 
					            SUM(EffectiveStorageMissCount) AS EffectiveStorageMissCount,

					            SUM(AccumulatedRainfallTotal) AS AccumulatedRainfallTotal, 
					            --SUM(AccumulatedRainfallTotal) / SUM(AccumulatedRainfallCount) AS AccumulatedRainfallAverage,
					            SUM(AccumulatedRainfallCount) AS AccumulatedRainfallCount, 
					            SUM(AccumulatedRainfallMissCount) AS AccumulatedRainfallMissCount,

					            SUM(InflowTotal) AS InflowTotal, 
					            --SUM(InflowTotal) / SUM(InflowCount) AS InflowAverage,
					            SUM(InflowCount) AS InflowCount, 
					            SUM(InflowMissCount) AS InflowMissCount, 
					
					            SUM(OutflowTotal) AS OutflowTotal, 
					            --SUM(OutflowTotal) / SUM(OutflowCount) AS OutflowAverage,
					            SUM(OutflowCount) AS OutflowCount, 
					            SUM(OutflowMissCount) AS OutflowMissCount

	            FROM           tbl_ReservoirDataSummary
	            WHERE        (StationNo IN @StationNo)
				             AND (DataType = @DataType)                             
                             AND (DataTypeValueDate BETWEEN @StartDate AND @EndDate) 
                            {0}
	            GROUP BY  DataType, DataTypeValueDate, DataTypeValue	
	            ORDER BY  {1}
                    ", strDataTypeValueCondition, summarySortType.ToString());

            var result = defaultDB.Query<ReservoirSummaryValue>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate,
                    StationNo = StationNo,
                    DataTypeValue = DataTypeValue,
                    DataType = summaryType.ToString()
                });

            return result.ToList();
        }

        /// <summary>
        /// 查詢並計算水庫各項數值的總和及平圴值 By 使用者定義的時間區間
        /// </summary>
        /// <param name="StartMonth">使用者定義的時間區間(開始月)</param>
        /// <param name="StartDay">使用者定義的時間區間(開始日)</param>
        /// <param name="EndMonth">使用者定義的時間區間(結束月)</param>
        /// <param name="EndDay">使用者定義的時間區間(結束日)</param>
        /// <param name="StationNo"></param>
        /// <param name="StartDate">歷年的開始時間,預設為1974/01/01</param>
        /// <param name="EndDate">歷年的結束時間,預設為當日</param>
        /// <returns></returns>
        public List<ReservoirSummaryValue> QueryReservoirSummaryByUserDefine(
            int StartMonth, int StartDay,
            int EndMonth, int EndDay,
            string StationNo,
            DateTime StartDate = default(DateTime), DateTime EndDate = default(DateTime))
        {
            //處理預設的期間
            if (StartDate == DateTime.MinValue) StartDate = Convert.ToDateTime("1974/01/01");
            if (EndDate == DateTime.MinValue) EndDate = DateTime.Now;

            //判斷使用者定義的時間區間, 是否為跨年度
            bool Cross_Year = StartMonth > EndMonth ? true : false;

            string strStartDate = string.Format("/{0}/{1}", StartMonth, StartDay);
            string strEndDate = string.Format("/{0}/{1} 23:59:59", EndMonth, EndDay);

            ReservoirHelper helper = new ReservoirHelper();
            CommonDataHelper commonDataHelper = new CommonDataHelper();

            #region 依區間計算
            ReservoirSummaryValue ValueInfo = new ReservoirSummaryValue();
            List<ReservoirSummaryValue> ValueInfoList = new List<ReservoirSummaryValue>();
            int DataTypeValue = 0;
            DateTime DataTypeValueDate = DateTime.MinValue;
            //逐年計算
            for (DateTime i = StartDate; i <= EndDate; i = i.AddYears(1))
            {
                DataTypeValueDate = Convert.ToDateTime(i.Year + strStartDate);
                //取得資料期間的資料
                if (Cross_Year)
                {
                    ValueInfo = helper.GetResvoirSummaryByPeriod(
                        Convert.ToDateTime(i.Year + strStartDate),
                        Convert.ToDateTime(i.Year + 1 + strEndDate),
                        StationNo);
                    DataTypeValue = i.Year + 1;
                }
                else
                {
                    ValueInfo = helper.GetResvoirSummaryByPeriod(
                        Convert.ToDateTime(i.Year + strStartDate),
                        Convert.ToDateTime(i.Year + strEndDate),
                        StationNo);
                    DataTypeValue = i.Year;
                }

                if (ValueInfo != null)
                {
                    //計算完成加入基本資料
                    ValueInfo.DataType = string.Format("{0}/{1}_{2}/{3}", StartMonth, StartDay, EndMonth, EndDay);
                    ValueInfo.DataTypeValue = DataTypeValue;
                    ValueInfo.DataTypeValueDate = DataTypeValueDate;

                    //計算結果放入 LIST
                    ValueInfoList.Add(ValueInfo);
                }
            }

            #endregion 依區間計算
            return ValueInfoList;
        }


        /// <summary>
        /// 水庫基本資料
        /// </summary>
        /// <param name="StationNo"></param>
        /// <returns></returns>
        public ReservoirInfo QueryReservoirInfo(string StationNo)
        {
            string sqlStatement =
                @"
                SELECT        StationNo, StationName, CityCode, BasinCode, EffectiveCapacity, FullWaterHeight, 
                                DeadWaterHeight, Latitude, Longitude, Storage, ProtectionFlood, 
                                HydraulicConstruction, Importance
                FROM           tbl_ReservoirStation
                WHERE        (StationNo = @StationNo)";

            var result = defaultDB.Query<ReservoirInfo>(
                sqlStatement,
                new
                {
                    StationNo = StationNo
                }).FirstOrDefault();

            return result;
        }

        /// <summary>
        /// 水庫規線基本資料
        /// </summary>
        /// <param name="StationNo"></param>
        /// <returns></returns>
        public List<ReservoirRule> QueryReservoirRule()
        {
            string sqlStatement = @"SELECT * FROM tbl_Demo_ReservoirRule";
            var result = defaultDB.Query<ReservoirRule>(sqlStatement);

            return result.ToList(); ;
        }

        /// <summary>
        /// 水庫即時資料
        /// </summary>
        /// <param name="StationNo"></param>
        /// <param name="TopRows"></param>
        /// <returns></returns>
        public List<QueryReservoirRealTimeData> QueryReservoirRealTimeData(string StationNo, int TopRows = 1)
        {
            string sqlStatement =
                string.Format(@"
                    SELECT  TOP {0}
                        R.StationNo, R.DataTime, R.HourMeanRain, R.AccumulatedRainfall, 
                        R.WaterHeight, R.EffectiveCapacity, R.EffectiveStorage, R.PercentageOfStorage, 
                        R.OperationalStorage, R.Inflow, R.Outflow, 
                        R.Status, R.NextSpillTime, R.Discharge, R.DischargeOfProtectionFlood, R.DischargeOfEscapeSand, 
                        R.DischargeOfHydroelectric, R.DischargeOfOthers,                         
                        R.DeadWaterHeight, R.FullWaterHeight, R.EvaporateLoss, R.Evaporate,
                        S.StationName 
                    FROM         tbl_ReservoirRealTimeData AS R INNER JOIN
                                 tbl_ReservoirStation AS S ON R.StationNo = S.StationNo
                    WHERE        (R.StationNo = @StationNo)
                    Order By R.DataTime Desc
                ", TopRows);

            var result = defaultDB.Query<QueryReservoirRealTimeData>(
                sqlStatement,
                new
                {
                    StationNo = StationNo
                });

            return result.ToList();
        }

        /// <summary>
        /// 計算水庫的小時雨量累積值
        /// </summary>
        /// <param name="DataTime">開始時間</param>
        /// <param name="StationNo"></param>
        /// <param name="hour">往前推算小時</param>
        /// <returns></returns>
        public decimal? GetSumHourMeanRainReservoir(DateTime DataTime, string StationNo, int hour)
        {
            try
            {
                DateTime StartDate = DataTime.AddHours(-hour);
                DateTime EndDate = DataTime;
                //小時雨量累積值
                string sqlStatement =
                    @"
                        SELECT        SUM(HourMeanRain) AS SumValue
                        FROM           tbl_ReservoirRealTimeData
                        WHERE       
                                (DataTime BETWEEN @StartDate AND @EndDate)
                            AND DATEPART(minute, DataTime) = @Minute
                        GROUP BY  StationNo
                        HAVING        (StationNo = @StationNo)
                        ";

                var result = defaultDB.Query<decimal?>(
                    sqlStatement,
                    new
                    {
                        StationNo = StationNo,
                        StartDate = StartDate,
                        EndDate = EndDate,
                        Minute = EndDate.Minute
                    }).FirstOrDefault();

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 水庫單日蓄水量排名
        /// </summary>
        /// <param name="MDDate"></param>
        /// <param name="nowAnnual"></param>
        /// <param name="valUpper"></param>
        /// <param name="valLower"></param>
        /// <returns></returns>
        public List<SingleDayEffectiveStorageData> GetSingleDayEffectiveStorageData(string MDDate, int nowAnnual, int valUpper, int valLower)
        {
            string sqlStatement =
            @"      WITH 
                    tbl_Data AS(
	                    SELECT Time AS DataTime,  *,FORMAT (Time, 'MM-dd') MDDate FROM vwReservoirDataApplication
	                    WHERE StationNo = '10201' AND FORMAT (Time, 'MM-dd') = @MDDate
                    ),
                    tbl_rule AS(
	                    SELECT *,FORMAT (DataDate, 'MM-dd') MDDate FROM tbl_ReservoirRule
	                    WHERE FORMAT (DataDate, 'MM-dd') = @MDDate
                    )

                    SELECT * ,ROW_NUMBER() OVER(ORDER BY T5.EffectiveStorage) AS Rank FROM
                    (							
	                    SELECT 
	                    YEAR(tbl_Data.DataTime) AS Year,
	                    YEAR(tbl_Data.DataTime)-1911 AS ROCYear,
	                    case
		                    when month(tbl_Data.DataTime) =11 then year(tbl_Data.DataTime)-1911+1
		                    when  month(tbl_Data.DataTime) =12 then year(tbl_Data.DataTime)-1911+1
		                    when  month(tbl_Data.DataTime)>=1 AND month(tbl_Data.DataTime)<=10 then year(tbl_Data.DataTime)-1911
	                    end as Annual,
	                    tbl_Data.MDDate,
	                    tbl_Data.EffectiveStorage AS EffectiveStorage,
	                    case
		                    when tbl_Data.EffectiveStorage < tbl_rule.LowerLimit AND  
			                    tbl_Data.EffectiveStorage > tbl_rule.SeriousLowerLimit Then '下限'
		                    when tbl_Data.EffectiveStorage < tbl_rule.SeriousLowerLimit Then '嚴重下限'
		                    when tbl_Data.EffectiveStorage > tbl_rule.LowerLimit Then '正常'
	                    end as State
	                    FROM tbl_Data
	                    LEFT JOIN tbl_rule ON tbl_Data.MDDate = tbl_rule.MDDate
                    ) AS T5
                     WHERE T5.Annual != @nowAnnual AND  (T5.EffectiveStorage Between @valLower AND  @valUpper)
                     ORDER BY T5.EffectiveStorage ASC
                ";
            var result = defaultDB.Query<SingleDayEffectiveStorageData>(sqlStatement,
                new
                {
                    MDDate = MDDate,
                    valLower = valLower,
                    valUpper = valUpper,
                    nowAnnual = nowAnnual,
                });

            return result.ToList();

        }

        /// <summary>
        /// 水庫範圍蓄水量排名
        /// </summary>
        /// <param name="MDDate"></param>
        /// <param name="nowAnnual"></param>
        /// <param name="valUpper"></param>
        /// <param name="valLower"></param>
        /// <returns></returns>
        public List<SingleDayEffectiveStorageData> GetRangeDayEffectiveStorageData(string stratDate, string endDate, int nowAnnual, int valUpper, int valLower)
        {
            string sqlStatement =
            @"
                    SELECT  * ,ROW_NUMBER() OVER(ORDER BY T5.EffectiveStorage) AS Rank FROM(
	                SELECT	
		                case
			                when month(T3.DataTime) =11 then year(T3.DataTime)-1911+1
			                when  month(T3.DataTime) =12 then year(T3.DataTime)-1911+1
			                when  month(T3.DataTime)>=1 AND month(T3.DataTime)<=10 then year(T3.DataTime)-1911
		                end as Annual,
						T3.DataTime AS DataTime,
			                Right('00000000' + Cast(T3.month as varchar),2)+'-'+Right('00000000' + Cast(T3.day as varchar),2) AS MDDate,
		                T4.EffectiveStorage AS EffectiveStorage_30502,
		                T3.EffectiveStorage AS EffectiveStorage_30501,
		                T4.EffectiveStorage + T3.EffectiveStorage AS EffectiveStorage,
		                case
			                when T4.EffectiveStorage + T3.EffectiveStorage < T3.LowerLimit AND  T4.EffectiveStorage + T3.EffectiveStorage > T3.SeriousLowerLimit Then '下限'
			                when T4.EffectiveStorage + T3.EffectiveStorage < T3.SeriousLowerLimit Then '嚴重下限'
			                when T4.EffectiveStorage + T3.EffectiveStorage > T3.LowerLimit Then '正常'
		                end as State
	                FROM
	                (
		                SELECT  T1.TenDays,T1.LowerLimit,T1.SeriousLowerLimit,
				                T2.DataTime,T2.StationNo,
				                T2.AccumulatedRainfall,T2.WaterHeight,T2.EffectiveCapacity,T2.EffectiveStorage,T2.InflowTotal,T2.OutflowTotal,
				                T1.day,T1.month
		                FROM
		                (
			                SELECT * ,MONTH(DataDate) as month, DAY(DataDate) as day FROM tbl_Demo_ReservoirRule
		                ) AS T1
		                Left join
		                (
			                SELECT * ,MONTH(DataTime) as month, DAY(DataTime) as day FROM vwReservoirAllData
			                WHERE StationNo = '30501'
		                )AS T2 ON T1.day = T2.day AND T1.month = T2.month
	                ) AS T3
	                Left join
	                (
		                SELECT * ,MONTH(DataTime) as month, DAY(DataTime) as day FROM vwReservoirAllData
		                WHERE StationNo = '30502'
	                ) AS T4 ON T3.DataTime = T4.DataTime 
	                ) AS T5
					WHERE (DataTime Between @stratDate AND @endDate) AND (EffectiveStorage Between @valLower AND @valUpper)
					ORDER BY Annual, DataTime
                ";
            var result = defaultDB.Query<SingleDayEffectiveStorageData>(sqlStatement,
                new
                {
                    stratDate = stratDate,
                    endDate = endDate,
                    valUpper = valUpper,
                    valLower = valLower,
                    nowAnnual = nowAnnual,
                });

            return result.ToList();

        }


        #endregion 查詢水庫資料


        #region 前台查資料用


        #region 水庫基本資料
        public IEnumerable<ReservoirRule> GetReservoirRuleDay(string StationNo)
        {
            string sqlStatement =
                @"
                    SELECT * FROM tbl_ReservoirRule WHERE StationNo = @StationNo
                ";
            var result = defaultDB.Query<ReservoirRule>(sqlStatement,
                new
                {
                    StationNo = StationNo,
                });

            return result;
        }
        #endregion 水庫基本資料

        #region 時間序列資料
        /// <summary>
        /// 基本水庫即時時間序列資料
        /// </summary>
        /// <param name="stratDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<ReservoirTimeSeriesData.RealTimeData> GetRealTimeReservoirTimeSeriesData
            (string stratDate, string endDate)
        {

            string sqlStatement =
            @"
                WITH tbl_10201_data AS(
	                SELECT [StationNo],Time,[AccumulatedRainfall],[EffectiveCapacity],[EffectiveStorage],[InflowTotal],[OutflowTotal]
	                FROM [vwReservoirDataApplication]
	                WHERE StationNo = '10201'AND Time BETWEEN  @stratDate AND @endDate
                )

                SELECT 
	                t1.Time AS DataTime,t1.Time AS ChartTime
	                ,t1.EffectiveStorage AS EffectiveStorage, t1.InflowTotal AS Inflow, t1.AccumulatedRainfall AS AccumulatedRainfall
	                ,SUM(t1.InflowTotal) OVER (PARTITION BY t1.StationNo ORDER BY t1.Time) AS 'InflowTotal_ACC'
	                ,SUM(t1.AccumulatedRainfall) OVER (PARTITION BY  t1.StationNo ORDER BY t1.Time) AS 'AccumulatedRainfall_ACC'
                FROM tbl_10201_data AS t1 
              
                ";

            //string sqlStatement =
            //@"
            //    SELECT t1.DataTime AS DataTime,tblDate.DateTime AS ChartTime
            //      ,t1.EffectiveStorage AS EffectiveStorage_30501, t1.Inflow AS Inflow_30501, t1.AccumulatedRainfall AS AccumulatedRainfall_30501
            //      ,t2.EffectiveStorage AS EffectiveStorage_30502, t2.Inflow AS Inflow_30502, t2.AccumulatedRainfall AS AccumulatedRainfall_30502
            //      ,t1.EffectiveStorage + t2.EffectiveStorage AS EffectiveStorage_Bind,PartNo
            //      ,SUM(t1.Inflow) OVER (PARTITION BY PartNo ORDER BY t1.DataTime) AS 'InflowTotal_ACC_30501'
            //      ,SUM(t2.Inflow) OVER (PARTITION BY PartNo ORDER BY t1.DataTime) AS 'InflowTotal_ACC_30502'
            //      ,SUM(t1.AccumulatedRainfall) OVER (PARTITION BY  PartNo ORDER BY t1.DataTime) AS 'AccumulatedRainfall_ACC_30501'
            //      ,SUM(t2.AccumulatedRainfall) OVER (PARTITION BY  PartNo ORDER BY t1.DataTime) AS 'AccumulatedRainfall_ACC_30502'
            //    FROM [A301_CNDSS].[dbo].[tbl_ReservoirRealTimeData] AS t1
            //    LEFT JOIN(
            //     SELECT *,CASE WHEN DataTime BETWEEN @stratDate AND @endDate THEN 1
            //           ELSE 0 END AS PartNo
            //         FROM [A301_CNDSS].[dbo].[tbl_ReservoirRealTimeData]
            //     WHERE StationNo = '30502' AND  DATEPART (HOUR,DataTime) = 23 
            //    ) AS t2 ON t1.DataTime = t2.DataTime
            //    RIGHT JOIN(
            //     SELECT * FROM GetDateTable(@stratDate, @endDate)
            //    ) AS tblDate ON Month(tblDate.DateTime) = Month(t1.DataTime) AND Day(tblDate.DateTime) = Day(t1.DataTime)
            //    WHERE t1.StationNo = '30502' AND  DATEPART (HOUR, t1.DataTime) = 23 AND t1.DataTime is not null AND t2.DataTime is not null
            //    AND t1.DataTime BETWEEN @stratDate AND @endDate
            //    ";
            var result = defaultDB.Query<ReservoirTimeSeriesData.RealTimeData>(sqlStatement,
                new
                {
                    stratDate = stratDate,
                    endDate = endDate
                });

            return result.ToList();

        }
        /// <summary>
        /// 水庫累計入流量即時時間序列資料
        /// </summary>
        /// <param name="stratDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<ReservoirTimeSeriesData.RealTimeData> GetRealTimeInflowAccTimeSeriesData
            (string stratDate, string endDate)
        {
            string sqlStatement =
            @"
                SELECT tbl_date.DateTime AS DataTime
		                ,InflowTotal_ACC_30501, InflowTotal_ACC_30502
                FROM GetDateTable(@stratDate, @endDate) AS tbl_date
                LEFT JOIN(
                SELECT t1.DataTime
		                ,SUM(t1.Inflow) OVER (PARTITION BY PartNo ORDER BY t1.DataTime) AS 'InflowTotal_ACC_30501'
		                ,SUM(t2.Inflow) OVER (PARTITION BY PartNo ORDER BY t1.DataTime) AS 'InflowTotal_ACC_30502'
                FROM [tbl_ReservoirRealTimeData] AS t1
                LEFT JOIN(
	                SELECT *,CASE WHEN DataTime BETWEEN @stratDate AND @endDate THEN 1
			                  ELSE 0 END AS PartNo
	                 FROM [tbl_ReservoirRealTimeData]
	                WHERE StationNo = '30502' AND  DATEPART (HOUR,DataTime) = 0 
                ) AS t2 ON t1.DataTime = t2.DataTime
                WHERE t1.StationNo = '30501' AND  DATEPART (HOUR, t1.DataTime) = 23 AND t1.DataTime is not null AND t2.DataTime is not null
                AND t1.DataTime BETWEEN @stratDate AND @endDate
                )AS tbl_data ON tbl_date.DateTime = tbl_data.DataTime
                ORDER BY tbl_date.DateTime
                ";
            var result = defaultDB.Query<ReservoirTimeSeriesData.RealTimeData>(sqlStatement,
                new
                {
                    stratDate = stratDate,
                    endDate = endDate
                });

            return result.ToList();

        }
        /// <summary>
        /// 水庫累計雨量即時時間序列資料
        /// </summary>
        /// <param name="stratDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<ReservoirTimeSeriesData.RealTimeData> GetRealTimeRainfallAccTimeSeriesData
            (string stratDate, string endDate)
        {
            string sqlStatement =
            @"
                SELECT tbl_date.DateTime AS DataTime
		                ,AccumulatedRainfall_ACC_30501, AccumulatedRainfall_ACC_30502
                FROM GetDateTable(@stratDate, @endDate) AS tbl_date
                LEFT JOIN(
                SELECT t1.DataTime
		                ,SUM(t1.AccumulatedRainfall) OVER (PARTITION BY  PartNo ORDER BY t1.DataTime) AS 'AccumulatedRainfall_ACC_30501'
		                ,SUM(t2.AccumulatedRainfall) OVER (PARTITION BY  PartNo ORDER BY t1.DataTime) AS 'AccumulatedRainfall_ACC_30502'
                FROM [tbl_ReservoirRealTimeData] AS t1
                LEFT JOIN(
	                SELECT *,CASE WHEN DataTime BETWEEN @stratDate AND @endDate THEN 1
			                  ELSE 0 END AS PartNo
	                 FROM [tbl_ReservoirRealTimeData]
	                WHERE StationNo = '30502' AND  DATEPART (HOUR,DataTime) = 23 
                ) AS t2 ON t1.DataTime = t2.DataTime
                WHERE t1.StationNo = '30501' AND  DATEPART (HOUR, t1.DataTime) = 23 AND t1.DataTime is not null AND t2.DataTime is not null
                AND t1.DataTime BETWEEN @stratDate AND @endDate
                )AS tbl_data ON tbl_date.DateTime = tbl_data.DataTime
                ORDER BY tbl_date.DateTime
                ";
            var result = defaultDB.Query<ReservoirTimeSeriesData.RealTimeData>(sqlStatement,
                new
                {
                    stratDate = stratDate,
                    endDate = endDate
                });

            return result.ToList();

        }

        /// <summary>
        /// 水庫規線時間序列資料
        /// </summary>
        /// <param name="stratDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<ReservoirTimeSeriesData.ReservoirRuleData> GetReservoirRuleTimeSeriesData
            (string stratDate, string endDate)
        {
            string sqlStatement =
            @"
                SELECT t1.DateTime AS DataTime,t1.DateTime AS ChartTime, t2.LowerLimit, t2.SeriousLowerLimit 
                FROM GetDateTable(@stratDate, @endDate) AS t1
                LEFT JOIN tbl_ReservoirRule AS t2 ON Month(t1.DateTime) = Month(t2.DataDate) AND Day(t1.DateTime) = Day(t2.DataDate)
                ORDER BY DateTime
            ";
            var result = defaultDB.Query<ReservoirTimeSeriesData.ReservoirRuleData>(sqlStatement,
                new
                {
                    stratDate = stratDate,
                    endDate = endDate
                });
            return result.ToList();

        }

        /// <summary>
        /// 超越機率時間序列資料
        /// </summary>
        /// <param name="stratDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<ReservoirTimeSeriesData.PiValueData> GetPiValueTimeSeriesData
            (string stratDate, string endDate, PiType piType,
            PiField piField = PiField.InflowTotalAverageValue)
        {
            string sqlStatement =
            @"
                SELECT	T1.DateTime AS ChartTime,T1.DateTime AS DataTime, Q10, Q20, Q30, Q40, Q50, Q60, Q70, Q75, Q80, Q85, Q90, Q95, QAverage
                FROM
                (
	                SELECT	DateTime,t2.Q10 ,t2.Q20 ,t2.Q30 ,t2.Q40 ,t2.Q50 ,t2.Q60 ,t2.Q70 ,t2.Q75 ,t2.Q80 ,t2.Q85 ,t2.Q90 ,t2.Q95, t2.QAverage
	                FROM GetDateTable(@stratDate, @endDate) AS t1
	                LEFT JOIN tbl_GridBoundaryPiValue AS t2 ON Month(t1.DateTime) = Month(t2.PiTypeValueDate) 
		                AND CASE 
			                WHEN DAY(DateTime)-10<=0 THEN 1+((MONTH(DateTime)-1)*3) 
			                WHEN 1<=(DAY(DateTime)-10) AND (DAY(DateTime)-10)<=10 THEN 2+((MONTH(DateTime)-1)*3)
			                WHEN 11<=DAY(DateTime)-10 THEN 3+((MONTH(DateTime)-1)*3)
		                END = t2.PiTypeValue
	                WHERE	t2.PiField = 'InflowTotalAverageValue' AND t2.PiType = 'TenDays'  AND t2.StartDate = '2002-01-01' AND t2.EndDate ='2021-12-31'
                ) AS T1
                ORDER BY DateTime
            ";
            var result = defaultDB.Query<ReservoirTimeSeriesData.PiValueData>(sqlStatement,
                new
                {
                    stratDate = stratDate,
                    endDate = endDate,
                    PiType = piType.ToString(),
                    PiField = piField.ToString(),
                });
            return result.ToList();

        }

        /// <summary>
        /// 歷史水庫時間序列資料
        /// </summary>
        /// <param name="stratDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<ReservoirTimeSeriesData.HistoryData> GetHistoryReservoirTimeSeriesData(string ChartStartDate, string ChartEndDate, string stratDate, string endDate)
        {
            string sqlStatement =
            @"
 
                    SELECT  tblDate.DateTime AS ChartTime, DataTime, SUBSTRING(convert(varchar, DataTime, 110),1,5) AS MDDate
		                    ,EffectiveStorage, InflowTotal, AccumulatedRainfall
							,SUM(InflowTotal) OVER (PARTITION BY PartNo ORDER BY DataTime) AS 'InflowTotal_ACC_30501'
							,SUM(AccumulatedRainfall) OVER (PARTITION BY  PartNo ORDER BY DataTime) AS 'AccumulatedRainfall_ACC_30501'
                    FROM(
		                    SELECT Time AS DataTime, EffectiveStorage,InflowTotal,AccumulatedRainfall
									,CASE 
									WHEN Time BETWEEN  @stratDate AND @endDate THEN 1
				                    ELSE 0
			                    END AS PartNo
		                    FROM vwReservoirDataApplication
		                    WHERE StationNo = '10201' AND  DATEPART (HOUR,Time) = 0   AND Time BETWEEN  @stratDate AND @endDate
                    ) AS t1
					Left JOIN(
						SELECT DateTime AS ChartTime, * FROM GetDateTable(@ChartStartDate, @ChartEndDate)
                    ) AS tblDate ON  FORMAT (tblDate.DateTime, 'MM-dd') = FORMAT (t1.DataTime, 'MM-dd')
				  WHERE ChartTime is not null
                ORDER BY tblDate.DateTime ASC
            
            ";
            var result = defaultDB.Query<ReservoirTimeSeriesData.HistoryData>(sqlStatement,
                new
                {
                    stratDate = stratDate,
                    endDate = endDate,
                    ChartStartDate = ChartStartDate,
                    ChartEndDate = ChartEndDate
                });
            return result.ToList();

        }
        /// <summary>
        /// 歷史水庫入流量時間序列資料
        /// </summary>
        /// <param name="stratDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<ReservoirTimeSeriesData.HistoryData> GetHistoryInflowAccTimeSeriesData(string stratDate, string endDate)
        {
            string sqlStatement =
            @"
                SELECT  DataTime, SUBSTRING(convert(varchar, DataTime, 110),1,5) AS MDDate
		                ,SUM(Inflow_30501) OVER (PARTITION BY PartNo ORDER BY DataTime) AS 'InflowTotal_ACC_30501'
		                ,SUM(Inflow_30502) OVER (PARTITION BY PartNo ORDER BY DataTime) AS 'InflowTotal_ACC_30502'
                FROM(
	                SELECT  
			                t30501.DataTime
			                ,t30501.EffectiveStorage AS EffectiveStorage_30501, t30501.InflowTotal AS Inflow_30501, t30501.AccumulatedRainfall AS AccumulatedRainfall_30501
			                ,t30502.EffectiveStorage AS EffectiveStorage_30502, t30502.InflowTotal AS Inflow_30502, t30502.AccumulatedRainfall AS AccumulatedRainfall_30502
			                ,t30501.EffectiveStorage + t30502.EffectiveStorage AS EffectiveStorage_BIND
			                ,CASE 
				                WHEN t30501.DataTime BETWEEN @stratDate AND @endDate THEN 1
				                ELSE 0
			                END AS PartNo
	                FROM vwReservoirAllData AS t30501
	                LEFT JOIN(
		                SELECT *
		                FROM vwReservoirAllData
		                WHERE StationNo = '30502' AND  DATEPART (HOUR,DataTime) = 0 
	                ) AS t30502 ON t30501.DataTime = t30502.DataTime
	                WHERE t30501.StationNo = '30501' AND t30501.DataTime BETWEEN @stratDate AND @endDate
                ) AS t1
                ORDER BY DataTime ASC
            ";
            var result = defaultDB.Query<ReservoirTimeSeriesData.HistoryData>(sqlStatement,
                new
                {
                    stratDate = stratDate,
                    endDate = endDate
                });
            return result.ToList();

        }
        /// <summary>
        /// 歷史水庫雨量時間序列資料
        /// </summary>
        /// <param name="stratDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<ReservoirTimeSeriesData.HistoryData> GetHistoryRainfallAccTimeSeriesData(string stratDate, string endDate)
        {
            string sqlStatement =
            @"
                SELECT  DataTime, SUBSTRING(convert(varchar, DataTime, 110),1,5) AS MDDate
		                ,SUM(AccumulatedRainfall_30501) OVER (PARTITION BY  PartNo ORDER BY DataTime) AS 'AccumulatedRainfall_ACC_30501'
		                ,SUM(AccumulatedRainfall_30502) OVER (PARTITION BY  PartNo ORDER BY DataTime) AS 'AccumulatedRainfall_ACC_30502'
                FROM(
	                SELECT  
			                t30501.DataTime
			                ,t30501.EffectiveStorage AS EffectiveStorage_30501, t30501.InflowTotal AS Inflow_30501, t30501.AccumulatedRainfall AS AccumulatedRainfall_30501
			                ,t30502.EffectiveStorage AS EffectiveStorage_30502, t30502.InflowTotal AS Inflow_30502, t30502.AccumulatedRainfall AS AccumulatedRainfall_30502
			                ,t30501.EffectiveStorage + t30502.EffectiveStorage AS EffectiveStorage_BIND
			                ,CASE 
				                WHEN t30501.DataTime BETWEEN @stratDate AND @endDate THEN 1
				                ELSE 0
			                END AS PartNo
	                FROM vwReservoirAllData AS t30501
	                LEFT JOIN(
		                SELECT *
		                FROM vwReservoirAllData
		                WHERE StationNo = '30502' AND  DATEPART (HOUR,DataTime) = 0 
	                ) AS t30502 ON t30501.DataTime = t30502.DataTime
	                WHERE t30501.StationNo = '30501' AND t30501.DataTime BETWEEN @stratDate AND @endDate
                ) AS t1
                ORDER BY DataTime ASC
            ";
            var result = defaultDB.Query<ReservoirTimeSeriesData.HistoryData>(sqlStatement,
                new
                {
                    stratDate = stratDate,
                    endDate = endDate
                });
            return result.ToList();

        }

        /// <summary>
        /// 歷史平均水庫時間序列資料
        /// </summary>
        /// <param name="stratDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<ReservoirTimeSeriesData.AverageData> GetReservoirAverageTimeSeriesData
            (string ChartStartDate, string ChartEndDate, string stratDate, string endDate, string StationNo = "10201")
        {
            string sqlStatement =
            @"
                SELECT
                FORMAT(Info_Time, 'MM-dd') AS MDDate,
                    SUM(AccumulatedRainfall) / COUNT(AccumulatedRainfall) AS AccumulatedRainfall_AVG,
                    SUM(InflowTotal) / COUNT(InflowTotal) AS InflowTotal_AVG,
                    SUM(EffectiveStorage) / COUNT(InflowTotal) AS EffectiveStorage_AVG
                FROM  vwReservoirDataApplication
                WHERE StationNo = @StationNo
			    AND(
				    (AccumulatedRainfall IS NOT NULL) 
				    OR (InflowTotal IS NOT NULL) 
				    OR (EffectiveStorage IS NOT NULL)
			    )
                GROUP BY FORMAT(Info_Time, 'MM-dd')
            ";
                var result = defaultDB.Query<ReservoirTimeSeriesData.AverageData>(sqlStatement,
                new
                {
                    StationNo = StationNo,
                    ChartStartDate = ChartStartDate,
                    ChartEndDate = ChartEndDate,
                    stratDate = stratDate,
                    endDate = endDate
                }, commandTimeout: 60);
            return result.ToList();

        }

        /// <summary>
        /// 歷史平均水庫時間序列資料
        /// </summary>
        /// <param name="stratDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<ReservoirTimeSeriesData.AverageData> GetReservoirAverageTimeSeriesData_old
            (string ChartStartDate, string ChartEndDate, string stratDate, string endDate)
        {
            string sqlStatement =
            @"
        SELECT*
		,SUM(InflowTotal_AVG) OVER(PARTITION BY PartNo ORDER BY FINAL.DateTime) AS 'InflowTotal_AVG_ACC'
		,SUM(AccumulatedRainfall_AVG) OVER(PARTITION BY  PartNo ORDER BY FINAL.DateTime) AS 'AccumulatedRainfall_AVG_ACC'
        FROM(
            SELECT  t1.Time AS DateTime
                    , t2.EffectiveStorage_AVG, t2.AccumulatedRainfall_AVG, t2.InflowTotal_AVG
                    , CASE WHEN t1.Time BETWEEN @stratDate AND  @endDate THEN 1

                            ELSE 0 END AS PartNo

                FROM vwReservoirDataApplication  AS t1

                LEFT JOIN(
                          SELECT

                        FORMAT(Time, 'MM-dd') AS MDDate,
                            SUM(AccumulatedRainfall) / COUNT(AccumulatedRainfall)  AS AccumulatedRainfall_AVG,
                            SUM(InflowTotal) / COUNT(InflowTotal)  AS InflowTotal_AVG,
                            SUM(EffectiveStorage) / COUNT(InflowTotal)  AS EffectiveStorage_AVG

                        FROM  vwReservoirDataApplication

                        WHERE StationNo = '10201' AND((AccumulatedRainfall is not null) OR(InflowTotal is not null) OR(EffectiveStorage is not null))

                        GROUP BY FORMAT(Time, 'MM-dd')
                ) AS t2 ON  FORMAT(t1.Time, 'MM-dd') = t2.MDDate

                WHERE StationNo = '10201' AND t1.Time BETWEEN @stratDate AND  @endDate
        ) AS FINAL

            ";
            var result = defaultDB.Query<ReservoirTimeSeriesData.AverageData>(sqlStatement,
            new
            {
                ChartStartDate = ChartStartDate,
                ChartEndDate = ChartEndDate,
                stratDate = stratDate,
                endDate = endDate
            }, commandTimeout: 60);
            return result.ToList();

        }



        #endregion

        #region 水庫屬性排名
        /// <summary>
        /// 水庫歷史資料排名(蓄水量、累計入流量、累計雨量)
        /// </summary>
        /// <param name="stratDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<ReservoirRankData> GetHistoryReservoirDataRank
            (string StratDate, string EndDate, string StationNo = "10201")
        {
            //string MDStartDate = Convert.ToDateTime(StratDate).ToString("MM-dd");
            //string MDEndDate = Convert.ToDateTime(EndDate).ToString("MM-dd");
            string MDStartDate = StratDate.Split('-')[1] + "-" + StratDate.Split('-')[2];
            string MDEndDate = EndDate.Split('-')[1] + "-" + EndDate.Split('-')[2];
            string sqlStatement = string.Format(
            @"
                WITH tbl_S AS (
                SELECT * ,ROW_NUMBER() OVER (PARTITION BY GroupNo ORDER BY DataTime ASC) AS rn
                FROM (
		                SELECT Time AS DataTime
							,EffectiveStorage ,InflowTotal ,AccumulatedRainfall, EffectiveCapacity
			                ,GroupNo = 
				                CASE 
					                WHEN YEAR(convert(datetime,  @StratDate)) = YEAR(convert(datetime,@EndDate)) THEN 
						                CASE
							                WHEN SUBSTRING(convert(varchar, t_data.Time, 110), 1, 5) >=@MDStartDate
								                AND SUBSTRING(convert(varchar, t_data.Time, 110), 1, 5) <=@MDEndDate Then YEAR(Time)+100
							                ELSE 0 
						                END
					                ELSE  
						                CASE
							                WHEN SUBSTRING(convert(varchar, t_data.Time, 110), 1, 5) >= @MDStartDate Then YEAR(Time)+10
							                WHEN SUBSTRING(convert(varchar, t_data.Time, 110), 1, 5) <= @MDEndDate Then YEAR(Time)+10-1 
							                ELSE 0 
						                END
				                END
			                ,DATEDIFF(DAY,  @StratDate, @EndDate)+1 AS Days
		                FROM (
			                SELECT  
					                Time
					                ,EffectiveStorage , InflowTotal, AccumulatedRainfall, EffectiveCapacity
			                FROM vwReservoirDataApplication 
							WHERE StationNo = @StationNo
		                ) AS t_data
	                ) AS t_Final
                )

                SELECT 
						Count,
                        CAST(YEAR(StartDate) AS varchar)+'-'+@MDStartDate AS OptStartDate
						,CAST(YEAR(EndDate) AS varchar)+'-'+@MDEndDate AS OptEndDate 
                        ,StartDate, EndDate, t2.EffectiveStorage
						,t2.EffectiveCapacity
		                ,TotalRainfall, TotalInflow
                FROM(
	                SELECT MIN(DataTime) AS StartDate, MAX(DataTime) AS EndDate
		                , SUM(InflowTotal) AS TotalInflow
		                , SUM(AccumulatedRainfall) AS TotalRainfall
		                , COUNT(GroupNo) AS Count, MAX(Days) AS DAYS
	                FROM tbl_S
	                GROUP BY GroupNo
                )AS t1
                RIGHT JOIN (SELECT DataTime, EffectiveStorage, EffectiveCapacity FROM tbl_S WHERE rn = 1) AS t2 ON t1.StartDate = t2.DataTime
                WHERE Count<366
                --WHERE Count = Days OR
	                -- ((day(dateadd(mm, 2, dateadd(ms,-3,DATEADD(yy, DATEDIFF(yy,0,EndDate), 0)))) = 29　OR day(dateadd(mm, 2, dateadd(ms,-3,DATEADD(yy, DATEDIFF(yy,0,EndDate), 0)))) = 28) AND (Days= Count-1 OR Days-1 = Count))--判斷平閏年
                ORDER BY　StartDate Desc
            ");
            var result = defaultDB.Query<ReservoirRankData>(sqlStatement,
                new
                {
                    StationNo = StationNo,
                    StratDate = StratDate,
                    EndDate = EndDate,
                    MDStartDate = MDStartDate,
                    MDEndDate = MDEndDate,

                });
            return result.ToList();

        }

        /// <summary>
        /// 水庫歷史蓄水量排名(單日)
        /// </summary>
        /// <param name="stratDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<ReservoirTimeSeriesData.HistoryData> GetHistoryRank
            (string MDDate, int valUpper = int.MaxValue, int valLower = int.MinValue)
        {
            string sqlStatement = string.Format(
            @"
	            SELECT  
			            t30501.DataTime, YEAR(t30501.DataTime) AS Year, SUBSTRING(convert(varchar, t30501.DataTime, 110), 1, 5) AS MDDate
			            ,t30501.EffectiveStorage AS EffectiveStorage_30501
			            ,t30502.EffectiveStorage AS EffectiveStorage_30502
			            ,t30501.EffectiveStorage + t30502.EffectiveStorage AS EffectiveStorage_BIND
	            FROM vwReservoirAllData AS t30501
	            LEFT JOIN(
		            SELECT *
		            FROM vwReservoirAllData
		            WHERE StationNo = '30502' AND  DATEPART (HOUR,DataTime) = 0 
	            ) AS t30502 ON t30501.DataTime = t30502.DataTime
	            WHERE t30501.StationNo = '30501' AND SUBSTRING(convert(varchar, t30502.DataTime, 110), 1, 5) = @MDDate
                ORDER BY EffectiveStorage_BIND Desc

            ");
            var result = defaultDB.Query<ReservoirTimeSeriesData.HistoryData>(sqlStatement,
                new
                {
                    MDDate = MDDate,
                });
            return result.ToList();

        }
        #endregion
        #endregion

        public IEnumerable<ReservoirRuleData> GetReservoirRule(string StationNo)
        {
            string sqlStatement =
                @"
                Select *, 
		                CASE TenDays 
		                When '上旬' then 1
		                When '中旬' then 11
		                When '下旬' then 21
		                End as day From(
                Select StationNo, month ,TenDays, LowerLimit, SeriousLowerLimit From
                (
	                SELECT Month(DataDate) as month,* FROM [tbl_Demo_ReservoirRule]
                )AS t1
                WHERE StationNo = '30502'
                Group by StationNo, month ,TenDays, LowerLimit, SeriousLowerLimit
                ) AS t2
                order by month, day
                ";
            var result = defaultDB.Query<ReservoirRuleData>(sqlStatement,
                new
                {
                    StationNo = StationNo,
                });

            return result;
        }


        public List<SummaryPiValue> GetTenDaysSummaryPiValueByDataTypeValueIndex(int start, int end)
        {
            string sqlStatement =
            @"
                SELECT [BoundaryID] ,[StartDate] ,[EndDate] ,[PiField] ,[PiType]
                        ,SUM([Q10]) AS Q10_SUM ,SUM([Q20]) AS Q20_SUM
                        ,SUM([Q30]) AS Q30_SUM ,SUM([Q40]) AS Q40_SUM
                        ,SUM([Q50]) AS Q50_SUM ,SUM([Q60]) AS Q60_SUM
                        ,SUM([Q70]) AS Q70_SUM ,SUM([Q75]) AS Q75_SUM
                        ,SUM([Q80]) AS Q80_SUM ,SUM([Q85]) AS Q85_SUM
                        ,SUM([Q90]) AS Q90_SUM ,SUM([Q95]) AS Q95_SUM
                        ,SUM([QAverage]) AS QAverage_SUM
                FROM [tbl_GridBoundaryPiValue]
                WHERE PiType = 'TenDays' AND (((([PiTypeValue]+5)%36)+1) between @start and @end)
                GROUP BY [BoundaryID] ,[StartDate] ,[EndDate] ,[PiField] ,[PiType]
            ";
            var result = defaultDB.Query<SummaryPiValue>(sqlStatement,
                new
                {
                    start = start,
                    end = end
                });

            return result.ToList();

        }




    }
}
