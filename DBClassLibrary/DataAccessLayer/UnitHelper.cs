using Dapper;
using DBClassLibrary.DomainLayer.UnitModel;
using DBClassLibrary.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DBClassLibrary.DataAccessLayer
{
    public class UnitHelper : BaseRepository
    {
        /// <summary>
        /// 單位列表
        /// </summary>
        /// <returns></returns>
        public IEnumerable<UnitData> GetUnitList()
        {
            string sqlStatement =
                @"SELECT UnitID, UnitNumber, UnitName, Unit_Type
					FROM AspNetUnits 
                    ORDER BY UnitNumber ";

            var result = defaultDB.Query<UnitData>(sqlStatement);
            return result;
        }

        /// <summary>
        /// 依單位編號取回
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public UnitData GeUnitData(int id)
        {
            string sqlStatement =
                @"SELECT      UnitID, UnitNumber, UnitName, Unit_Type
					FROM AspNetUnits 
					Where UnitID = @ID";
            var result = defaultDB.Query<UnitData>(
                sqlStatement,
                new
                {
                    ID = id
                }).FirstOrDefault();

            return result;
        }

        /// <summary>
        /// 單位是否有使用者
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool IsUnithaveUser(int id)
        {
            string sqlStatement =
                @"SELECT        TOP (1) UserId, UnitID
					FROM           AspNetUserUnits
					WHERE        (UnitID = @UnitID)";
            var result = defaultDB.Query<UnitData>(
                sqlStatement,
                new
                {
                    UnitID = id
                }).FirstOrDefault();

            return result == null ? false : true;
        }

        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="ItemData"></param>
        /// <returns></returns>
        public int InsertUnitData(UnitData ItemData)
        {
            string sql = @"INSERT INTO AspNetUnits
					(UnitNumber, UnitName, Unit_Type)
					OUTPUT INSERTED.UnitID
					VALUES   (@UnitNumber, @UnitName, @Unit_Type)";

            int executeResult = 0;
            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.ExecuteScalar<int>(sql, ItemData);
                else
                    executeResult = defaultDB.ExecuteScalar<int>(sql, ItemData, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }

        /// <summary>
        /// 修改
        /// </summary>
        /// <param name="ItemData"></param>
        /// <returns></returns>
        public int UpdateUnitData(UnitData ItemData)
        {
            string sql = @"UPDATE       AspNetUnits
							SET   UnitNumber = @UnitNumber, UnitName = @UnitName, Unit_Type = @Unit_Type
						   WHERE  (UnitID = @UnitID) ";

            int executeResult = 0;
            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql, ItemData);
                else
                    executeResult = defaultDB.Execute(sql, ItemData, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }

        /// <summary>
        /// 刪除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int DelUnitData(int id)
        {
            //檢查是否有使用者屬於該單位
            if (IsUnithaveUser(id) == false)
            {
                string sql = @"DELETE FROM AspNetUnits
								WHERE (UnitID = @ID)";

                int executeResult = 0;
                try
                {
                    if (UsingTransaction == null)
                        executeResult = defaultDB.Execute(sql, new { ID = id });
                    else
                        executeResult = defaultDB.Execute(sql, new { ID = id }, UsingTransaction);
                }
                catch (Exception e)
                {
                    throw e.GetBaseException();
                }
                return executeResult;
            }
            else
                throw new Exception("已有使用者屬於該單位, 不可刪除!");
        }
    }

}
