using Dapper;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class CalcDataHelper : BaseRepository
    {
        #region 超越機率 計算

        /// <summary>
        /// 取得資料期間的(某時間段)的超越機率(用加總或平均的值計算)
        /// </summary>
        /// <param name="StartDate">資料開始期間</param>
        /// <param name="EndDate">資料結束期間</param>
        /// <param name="DataStartDate">計算開始日</param>
        /// <param name="DataEndDate">計算結束日</param>
        /// <param name="piType">計算週期種類</param>
        /// <param name="piField">計算時的採用值種類</param>
        /// <param name="CalcType">計算時使用 加總或平均值 (AverageValue, TotalValue) </param>
        /// <param name="TargetTableName">加總或平均值來源</param>
        /// <param name="BoundaryID">邊界編號</param>
        /// <param name="boundaryType">邊界種類</param>
        /// <returns></returns>
        public List<ItemValuePi> GetSummeryPiByPeroid(
            DateTime StartDate, DateTime EndDate,
            DateTime DataStartDate, DateTime DataEndDate,
            PiType piType, PiField piField, string CalcType,
            string TargetTableName , string[] BoundaryID, BoundaryType boundaryType)
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
						AND (BoundaryID IN @BoundaryID)
                        AND (BoundaryType = @BoundaryType)
						AND DataTypeValueDate Between @StartDate AND @EndDate

						AND DATEPART(MONTH, DataTypeValueDate) = @DataStartMonth 
						AND DATEPART(Day, DataTypeValueDate) = @DataStartDay

                        AND DataType = @DataType
                        AND FieldName = @FieldName
					GROUP BY DataTypeValueDate) as tbl_Count

                SELECT   DataTypeValueDate,
		            SUM({1}) as ItemValue,
                    ROW_NUMBER() OVER(ORDER BY SUM({1}) Desc) AS SortFlag,
		            Cast( ROW_NUMBER() OVER(ORDER BY SUM({1}) Desc) / cast(@N+1 as decimal(8,4)) as decimal(8,4)) as Pi
	                From {0}
	            Where 
		            {1} > 0
					AND (BoundaryID IN @BoundaryID)
                    AND (BoundaryType = @BoundaryType)
					AND DataTypeValueDate Between @StartDate AND @EndDate

					AND DATEPART(MONTH, DataTypeValueDate) = @DataStartMonth 
					AND DATEPART(Day, DataTypeValueDate) = @DataStartDay

                    AND DataType = @DataType
                    AND FieldName = @FieldName
				GROUP BY DataTypeValueDate", TargetTableName, CalcType);

            var result = defaultDB.Query<ItemValuePi>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate,

                    DataStartMonth = DataStartDate.Month,
                    DataStartDay = DataStartDate.Day,

                    DataType = piType.ToString(),
                    BoundaryID = BoundaryID,
                    BoundaryType = (int)boundaryType,
                    FieldName = piField.ToString()
                });

            return result.ToList();
        }

        /// <summary>
        /// 刪除原有的計算值
        /// </summary>
        /// <returns></returns>
        public int DeletePiValue(DateTime StartDate, DateTime EndDate,
            string BoundaryID, BoundaryType boundaryType, string piType, string piField,
            string ResultTableName)
        {
            string sql = string.Format(
                        @"DELETE FROM {0}
                            WHERE        
                                (BoundaryID = @BoundaryID) 
                                AND (BoundaryType = @BoundaryType) 
                                AND (StartDate = @StartDate) 
                                AND (EndDate = @EndDate) 
                                AND (PiType = @piType)
                                AND (PiField = @piField)
                          ", ResultTableName);

            int executeResult = 0;
            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql,
                        new
                        {
                            StartDate = StartDate,
                            EndDate = EndDate,
                            BoundaryID = BoundaryID,
                            BoundaryType = (int)boundaryType,
                            piType = piType,
                            piField = piField
                        });
                else
                    executeResult = defaultDB.Execute(sql,
                        new
                        {
                            StartDate = StartDate,
                            EndDate = EndDate,
                            BoundaryID = BoundaryID,
                            BoundaryType = (int)boundaryType,
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


        #endregion 超越機率 計算

        #region 計算各項數值的總和及平圴值

        /// <summary>
        ///  計算各項數值的總和及平圴值
        /// </summary>
        /// <param name="StartDate"></param>
        /// <param name="EndDate"></param>
        /// <param name="BoundaryID"></param>
        /// <param name="TargetTableName"></param>
        /// <param name="FieldName">要計算的值欄位名稱</param>
        /// <param name="GroupFieldName">群組的欄位名稱</param>
        /// <returns></returns>
        public SummaryValue GetSummaryByPeriod(DateTime StartDate, DateTime EndDate
            , string BoundaryID, BoundaryType boundaryType
            , string TargetTableName, string FieldName, string GroupFieldName)
        {
            string sqlStatement =
                string.Format(@"
                    SELECT      {1} as BoundaryID

	                    ,SUM(CASE WHEN {2} >= 0 THEN {2} Else 0 END) as TotalValue
	                    ,0 as AverageValue
	                    ,SUM(CASE WHEN {2} >= 0 THEN 1 Else 0 END) as DataCount
	                    ,SUM(CASE WHEN {2} < 0 OR {2} IS NULL THEN 1 Else 0 END) as DataMissCount

                    FROM           {0}
                    WHERE        
                        ({1} = @BoundaryID) 
                        AND (BoundaryType = @BoundaryType)
                        AND (DataTime BETWEEN @StartDate AND @EndDate) 
                        Group BY {1}
                    ", TargetTableName, GroupFieldName, FieldName);

            var result = defaultDB.Query<SummaryValue>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate,
                    BoundaryID = BoundaryID,
                    BoundaryType = boundaryType
                }).FirstOrDefault();

            return result;
        }

        /// <summary>
        /// 刪除原有的計算值
        /// </summary>
        /// <returns></returns>
        public int DeleteSummaryValue(string BoundaryID, string FieldName,
            string DataType, BoundaryType boundaryType, DateTime DataTypeValueDate)
        {
            string sql = @"DELETE FROM tbl_DataSourceSummary
                            WHERE        
                            (BoundaryID = @BoundaryID) 
                            AND (BoundaryType = @BoundaryType) 
                            AND (FieldName = @FieldName) 
                            AND (DataType = @DataType) 
                            AND (DataTypeValueDate = @DataTypeValueDate)";

            int executeResult = 0;
            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql,
                        new
                        {
                            BoundaryID = BoundaryID,
                            BoundaryType = (int)boundaryType,
                            FieldName = FieldName,
                            DataType = DataType,
                            DataTypeValueDate = DataTypeValueDate
                        });
                else
                    executeResult = defaultDB.Execute(sql,
                        new
                        {
                            BoundaryID = BoundaryID,
                            BoundaryType = (int)boundaryType,
                            FieldName = FieldName,
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

        #endregion 計算各項數值的總和及平圴值

        #region 查詢資料
        #endregion 查詢資料

    }
}
