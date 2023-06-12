using Dapper;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer.MenuModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class MenuHelper : BaseRepository
    {
        /// <summary>
        /// 取得系統功能選單列表
        /// </summary>
        /// <returns></returns>
        public List<AppMenu> GetAppMenuList()
        {
            string sqlStatement =
                @"SELECT * FROM tbl_AppMenu
                    ORDER BY Layer, Ordinal";

            var result = defaultDB.Query<AppMenu>(sqlStatement);

            ReorganizeAppMenuList(result);

            return result.OrderBy(m => m.Serial).ToList();
        }

        /// <summary>
        /// 設定系統功能選單序列資訊
        /// </summary>
        /// <param name="MenuList"></param>
        public void ReorganizeAppMenuList(IEnumerable<AppMenu> MenuList)
        {
            int maxLayer = MenuList.Count() > 0 ? MenuList.Select(m => m.Layer).Max() : 0;

            foreach (var menu in MenuList)
            {
                menu.Checked = false;
                menu.SubMenu = new List<AppMenu>();
                var parent = MenuList.Where(m => m.Id == menu.Parent).FirstOrDefault();
                if (parent != null) parent.SubMenu.Add(menu);
                menu.Serial = menu.Ordinal * (int)Math.Pow(10, (maxLayer - menu.Layer) * 2) + (parent == null ? 0 : parent.Serial);
                menu.ParentMenu = parent;
            }
        }

        /// <summary>
        /// 取得群組功能選單列表
        /// </summary>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public List<RoleMenu> GetRoleMenuList(string RoleId)
        {
            string sqlStatement =
                @"SELECT * FROM tbl_AppRoleMenu
                    WHERE RoleId = @RoleId";

            var sqlParams = new
            {
                RoleId = RoleId
            };

            var result = defaultDB.Query<RoleMenu>(sqlStatement, sqlParams);

            return result.ToList();
        }

        /// <summary>
        /// 刪除群組功能選單
        /// </summary>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public int DeleteRoleMenu(string RoleId)
        {
            string sql = @"DELETE FROM tbl_AppRoleMenu
							WHERE RoleId = @RoleId";

            var sqlParams = new
            {
                RoleId = RoleId
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
        /// 更新群組功能選單
        /// </summary>
        /// <param name="MenuList"></param>
        /// <returns></returns>
        public int UpdateRoleMenu(List<RoleMenu> MenuList)
        {
            DBHelper helper = new DBHelper();

            DataTable table = helper.IEnumerableToDataTable(MenuList);

            return helper.NoneClearInsertTable("tbl_AppRoleMenu", table);
        }

        /// <summary>
        /// 取得使用者我的最愛功能選單列表
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public List<UserMenu> GetUserMenuList(string UserId)
        {
            string sqlStatement =
                @"SELECT * FROM tbl_AppUserMenu
                    WHERE UserId = @UserId
                    ORDER BY Ordinal";

            var sqlParams = new
            {
                UserId = UserId
            };

            var result = defaultDB.Query<UserMenu>(sqlStatement, sqlParams);

            return result.ToList();
        }

        /// <summary>
        /// 刪除使用者我的最愛功能選單
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public int DeleteUserMenu(string UserId)
        {
            string sql = @"DELETE FROM tbl_AppUserMenu
							WHERE UserId = @UserId";

            var sqlParams = new
            {
                UserId = UserId
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
        /// 更新使用者我的最愛功能選單
        /// </summary>
        /// <param name="MenuList"></param>
        /// <returns></returns>
        public int UpdateUserMenu(List<UserMenu> MenuList)
        {
            DBHelper helper = new DBHelper();

            DataTable table = helper.IEnumerableToDataTable(MenuList);

            return helper.NoneClearInsertTable("tbl_AppUserMenu", table);
        }

    }
}
