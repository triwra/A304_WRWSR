using Dapper;
using DBClassLibrary.Data;
using System;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class FhyDataHelper : BaseRepository
    {
        #region 水庫

        /// <summary>
        /// 水庫每日營運狀況, 刪除同一日的資料(刪除已有資料)
        /// </summary>
        /// <param name="DataDate"></param>
        /// <param name="ST_NO"></param>
        /// <returns></returns>
        public int DelReservoirSummaryHistory(DateTime DataDate, string ST_NO)
        {

            string sql = @"DELETE FROM           tbl_wsReservoirSummaryHistory_fhy
							WHERE        (Time BETWEEN @StartDate AND @EndDate) 
                                        And StationNo = @ST_NO";

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
        /// 刪除 tbl_wsReservoirInfoHistory 同一日的資料, 只保留最新一筆
        /// </summary> 
        public int DelReservoirInfoHistory(DateTime DataDate, string ST_NO)
        {

            string sql = @"DELETE FROM           tbl_wsReservoirInfoHistory_fhy
							WHERE        (Time BETWEEN @StartDate AND @EndDate) 
                                        And StationNo = @ST_NO";

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

    }
}
