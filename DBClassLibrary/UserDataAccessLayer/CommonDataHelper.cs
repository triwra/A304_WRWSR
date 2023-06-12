using Dapper;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer.CommonDataModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class CommonDataHelper : BaseRepository
    {
        /// <summary>
        /// 取得系統參數設定列表
        /// </summary>
        /// <param name="Category"></param>
        /// <param name="Type"></param>
        /// <returns></returns>
        public List<AppParam> GetAppParam(string Category = null, string Type = null)
        {
            string sqlStatement =
                @"SELECT * FROM tbl_AppParam
                    WHERE Category = CASE WHEN @Category IS NULL THEN Category ELSE @Category END 
                    AND Type = CASE WHEN @Type IS NULL THEN Type ELSE @Type END 
                    ORDER BY Category, Type, Ordinal";

            var sqlParams = new
            {
                Category = Category,
                Type = Type
            };

            var result = defaultDB.Query<AppParam>(sqlStatement, sqlParams);

            return result.ToList();
        }

        /// <summary>
        /// 取得系統參數設定
        /// </summary>
        /// <param name="Category"></param>
        /// <param name="Type"></param>
        /// <param name="Name"></param>
        /// <returns></returns>
        public AppParam GetAppParam(string Category, string Type, string Name)
        {
            string sqlStatement =
                @"SELECT * FROM tbl_AppParam
                    WHERE Category = @Category AND Type = @Type AND Name = @Name
                    ORDER BY Ordinal";

            var sqlParams = new
            {
                Category = Category,
                Type = Type,
                Name = Name
            };

            var result = defaultDB.Query<AppParam>(sqlStatement, sqlParams);

            return result.FirstOrDefault();
        }

        /// <summary>
        /// 更新系統參數設定
        /// </summary>
        /// <param name="Param"></param>
        /// <returns></returns>
        public int UpdateAppParam(AppParam Param)
        {
            string sqlStatement = @"UPDATE tbl_AppParam SET
                                    Category = @Category,
                                    Type = @Type,
                                    Name = @Name,
                                    Label = @Label,
                                    Value = @Value,
                                    Ordinal = @Ordinal,
                                    Note = @Note
                                    WHERE Id = @Id";

            int executeResult;
            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sqlStatement, Param);
                else
                    executeResult = defaultDB.Execute(sqlStatement, Param, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }

            return executeResult;
        }

        /// <summary>
        /// 取得使用者暱稱
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public string GetUserRealNameById(string UserId)
        {
            string sqlStatement =
                @"SELECT RealName
                  FROM [AspNetUsers]
                  WHERE Id = @UserId";

            var sqlParams = new
            {
                UserId = UserId
            };

            var result = defaultDB.Query<string>(sqlStatement, sqlParams);

            return result.ToArray()[0];
        }

        #region Action Log 相關

        /// <summary>
        /// 新增 ActionLog
        /// </summary>
        /// <param name="Log"></param>
        /// <returns></returns>
        public int AddActionLog(ActionLog Log)
        {
            string sql = @"INSERT INTO tbl_ActionLog
							 (UserId, Controller, Action, Parameters, IP, UpdateTime)
						   VALUES        
                             (@UserId, @Controller, @Action, @Parameters, @IP, @UpdateTime)";

            int executeResult = 0;

            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql, Log);
                else
                    executeResult = defaultDB.Execute(sql, Log, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }

            return executeResult;
        }

        /// <summary>
        /// 取得 AppUserData (依 UserId)
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public AppUserData GetAppUserData(string UserId)
        {
            string sqlStatement =
                @"SELECT * FROM tbl_AppUserData
                    WHERE UserId = @UserId ";

            var sqlParams = new
            {
                UserId
            };

            var result = defaultDB.Query<AppUserData>(sqlStatement, sqlParams);

            return result.FirstOrDefault();
        }

        /// <summary>
        /// 新增 AppUserData (用來記錄 該使用者的異動時間)
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="CreateTime"></param>
        /// <returns></returns>
        public int AddAppUserData(string UserId, DateTime CreateTime)
        {
            string sql = @"INSERT INTO tbl_AppUserData
							 (UserId, AccountCreateTime, LastChangePwdTime)
						   VALUES        
                             (@UserId, @CreateTime, @CreateTime)";

            var sqlParams = new
            {
                UserId,
                CreateTime
            };

            int executeResult = 0;

            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql, sqlParams);
                else
                    executeResult = defaultDB.Execute(sql, sqlParams, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }

            return executeResult;
        }

        /// <summary>
        /// 補登 AppUserData
        /// </summary>
        /// <param name="UserId"></param>
        public void PatchAppUserData(string UserId)
        {
            var time = new DateTime(2019, 11, 1);
            AddAppUserData(UserId, time);
            UpdateLastAccessTime(UserId, time);
        }

        /// <summary>
        /// 更新 最近存取時間
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="UpdateTime"></param>
        /// <returns></returns>
        public int UpdateLastAccessTime(string UserId, DateTime UpdateTime)
        {
            string sqlStatement = @"UPDATE tbl_AppUserData SET
                                    LastAccessTime = @UpdateTime
                                    WHERE UserId = @UserId";

            var sqlParams = new
            {
                UserId,
                UpdateTime
            };

            int executeResult = 0;

            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sqlStatement, sqlParams);
                else
                    executeResult = defaultDB.Execute(sqlStatement, sqlParams, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }

            return executeResult;
        }

        /// <summary>
        /// 更新 最近登入時間
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="UpdateTime"></param>
        /// <returns></returns>
        public int UpdateLastLoginTime(string UserId, DateTime UpdateTime)
        {
            string sqlStatement = @"UPDATE tbl_AppUserData SET
                                    LastLoginTime = @UpdateTime
                                    WHERE UserId = @UserId";

            var sqlParams = new
            {
                UserId,
                UpdateTime
            };

            int executeResult = 0;

            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sqlStatement, sqlParams);
                else
                    executeResult = defaultDB.Execute(sqlStatement, sqlParams, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }

            return executeResult;
        }

        /// <summary>
        /// 更新 最近變更密碼時間
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="UpdateTime"></param>
        /// <returns></returns>
        public int UpdateLastChangePwdTime(string UserId, DateTime UpdateTime)
        {
            string sqlStatement = @"UPDATE tbl_AppUserData SET
                                    LastChangePwdTime = @UpdateTime
                                    WHERE UserId = @UserId";

            var sqlParams = new
            {
                UserId,
                UpdateTime
            };

            int executeResult = 0;

            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sqlStatement, sqlParams);
                else
                    executeResult = defaultDB.Execute(sqlStatement, sqlParams, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }

            return executeResult;
        }

        #endregion Action Log 相關

        #region 共用的選單

        /// <summary>
        /// Sort 條件的欄位
        /// </summary>
        /// <returns></returns>
        public List<CommonFieldList> GetSortFieldList()
        {
            var DataFieldList = new List<CommonFieldList>{
                new CommonFieldList{ItemID="1", ItemName="發表時間(新→舊)"},
                new CommonFieldList{ItemID="2", ItemName="發表時間(舊→新)"},
                };

            return DataFieldList;
        }

        #endregion 共用的選單

        #region 管理處 相關

        /// <summary>
        /// 依管理處查詢工作站名單
        /// </summary>
        /// <param name="StartDate"></param>
        /// <param name="EndDate"></param>
        /// <param name="SupplyType"></param>
        /// <returns></returns>
        public List<IAStation> GetIAStationList(string IANo)
        {            
            string sqlStatement =
                string.Format(@"
                    SELECT  WorkStationId, IANo, IAName, MngNo, WorkStationNo, 
                            WorkStationName, Longitude, Latitude, Area
                    FROM    tbl_IAStation
                    WHERE   (IANo = @IANo)
                ");

            var result = defaultDB.Query<IAStation>(
                sqlStatement,
                new
                {
                    IANo = IANo
                });

            return result.ToList();
        }

        #endregion 管理處 相關
    }
}
