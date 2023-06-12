using Dapper;
using DBClassLibrary.Data;
using DBClassLibrary.DomainLayer.UnitModel;
using DBClassLibrary.DomainLayer.UserModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DBClassLibrary.DataAccessLayer
{
    public class UserHelper : BaseRepository
    {
        /// <summary>
        /// 登入帳號名單
        /// </summary>
        /// <returns></returns>
        public IEnumerable<UserData> GetUsersList()
        {
            string sqlStatement =
                @"SELECT        Id, Email, EmailConfirmed, SecurityStamp, PhoneNumber, PhoneNumberConfirmed, 
						TwoFactorEnabled, LockoutEndDateUtc, LockoutEnabled, AccessFailedCount, 
						UserName, RealName, SubUnit
						FROM           AspNetUsers
						WHERE        (LockoutEnabled = 1) AND (LockoutEndDateUtc < DATEADD(hour, - 8, GETDATE())) OR
									 (LockoutEndDateUtc IS NULL)";
            var result = defaultDB.Query<UserData>(sqlStatement);

            foreach (var user in result)
            {
                user.UnitsList = GetUnits(user.Id);
                user.RolesList = GetRoles(user.Id);
            }

            return result;
        }

        /// <summary>
        /// 鎖定帳號名單
        /// </summary>
        /// <returns></returns>
        public IEnumerable<UserData> GetLockoutUsersList(bool Register)
        {
            string sqlStatement =
                @"SELECT        Id, Email, EmailConfirmed, SecurityStamp, PhoneNumber, 
								PhoneNumberConfirmed, TwoFactorEnabled, LockoutEndDateUtc, LockoutEnabled, 
								AccessFailedCount, UserName, RealName
					FROM           AspNetUsers
					WHERE        (LockoutEnabled = 1) AND (LockoutEndDateUtc > DATEADD(hour, - 8, GETDATE())) AND (Register = @Register) ";

            var sqlParams = new
            {
                Register = Register
            };

            var result = defaultDB.Query<UserData>(sqlStatement, sqlParams);

            foreach (var user in result)
            {
                user.UnitsList = GetUnits(user.Id);
                user.RolesList = GetRoles(user.Id);
            }

            return result;
        }

        /// <summary>
        /// 刪除使用者所屬的單位
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int DelUserUnitData(string id)
        {
            string sql = @"DELETE FROM AspNetUserUnits
								WHERE (UserId = @UserId)";

            int executeResult = 0;
            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql, new { UserId = id });
                else
                    executeResult = defaultDB.Execute(sql, new { UserId = id }, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }

        /// <summary>
        /// 設定使用者所屬的單位
        /// </summary>
        /// <param name="Id">UserID</param>
        /// <param name="UnitID">所屬的單位</param>
        /// <returns></returns>
        public int AddToUnit(string Id, int UnitID)
        {
            //先刪除原有的單位
            DelUserUnitData(Id);

            string sql = @"INSERT INTO AspNetUserUnits
							 (UserId, UnitID)
						   VALUES        (@UserId, @UnitID)";
            UserUnitData ItemData = new UserUnitData();

            ItemData.UserID = Id;
            ItemData.UnitID = UnitID;
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
        /// 設定使用者所屬的單位
        /// </summary>
        /// <param name="Id">UserID</param>
        /// <param name="ItemData">所屬的單位清單</param>
        /// <returns></returns>
        public int AddToUnits(string Id, List<UserUnitData> ItemData)
        {
            DelUserUnitData(Id);
            if (ItemData == null || ItemData.Count == 0)
                return 0;

            string sql = @"INSERT INTO AspNetUserUnits
							 (UserId, UnitID)
						   VALUES        (@UserId, @UnitID)";

            foreach (var item in ItemData)
            {
                item.UserID = Id;
            }

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
        /// 依編號取回所屬單位
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<UserUnitData> GetUnits(string id)
        {
            string sqlStatement =
                @"SELECT        AspNetUserUnits.UserId, AspNetUserUnits.UnitID, AspNetUnits.UnitNumber, AspNetUnits.UnitName
					FROM           AspNetUserUnits INNER JOIN
										 AspNetUnits ON AspNetUserUnits.UnitID = AspNetUnits.UnitID
					WHERE        (AspNetUserUnits.UserId = @ID)";
            var result = defaultDB.Query<UserUnitData>(
                sqlStatement,
                new
                {
                    ID = id
                });

            return result.ToList();
        }

        /// <summary>
        /// 判斷某個使用者是否屬於某個單位
        /// </summary>
        /// <param name="UserId">使用者ID</param>
        /// <param name="UnitName">單位名稱</param>
        /// <returns></returns>
        public bool IsInUnit(string UserId, string UnitName)
        {
            string sqlStatement =
                @"SELECT        AspNetUserUnits.UserId, AspNetUserUnits.UnitID, AspNetUnits.UnitNumber, AspNetUnits.UnitName
					FROM           AspNetUserUnits INNER JOIN
										 AspNetUnits ON AspNetUserUnits.UnitID = AspNetUnits.UnitID
					WHERE        (AspNetUserUnits.UserId = @UserId) AND (AspNetUnits.UnitName = @UnitName)";
            var result = defaultDB.Query<UnitData>(
                sqlStatement,
                new
                {
                    ID = UserId,
                    UnitName = UnitName

                }).FirstOrDefault();

            return result == null ? false : true;
        }

        /// <summary>
        /// 依編號取回所屬角色
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<string> GetRoles(string id)
        {
            string sqlStatement =
                @"SELECT        AspNetRoles.Name
					FROM           AspNetUserRoles INNER JOIN
										 AspNetRoles ON AspNetUserRoles.RoleId = AspNetRoles.Id
					WHERE        (AspNetUserRoles.UserId = @ID)";
            var result = defaultDB.Query<string>(
                sqlStatement,
                new
                {
                    ID = id
                });

            return result.ToList();
        }

        /// <summary>
        /// 依角色名稱取得使用者列表
        /// </summary>
        /// <param name="Role"></param>
        /// <returns></returns>
        public List<UserData> GetUserListByRole(string Role)
        {
            string sqlStatement =
                @"SELECT u.*
                    FROM AspNetUserRoles a
                    LEFT JOIN AspNetRoles b ON b.Id = a.RoleId
                    LEFT JOIN AspNetUsers u ON u.Id = a.UserId
                    WHERE b.Name = @Role";

            var sqlParams = new
            {
                Role = Role
            };

            var result = defaultDB.Query<UserData>(sqlStatement, sqlParams);

            return result.ToList();
        }
    }
}
