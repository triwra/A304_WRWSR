using Dapper;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer.ActionLogModel;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class ActionLogHelper : BaseRepository
    {
        /// <summary>
        /// 取得列表(依分頁)
        /// </summary>
        /// <param name="Option"></param>
        /// <returns></returns>
        public List<QueryActionLog> GetDataList(ContentQueryOption Option)
        {
            Option.EndDate = Option.EndDate.AddDays(1).AddSeconds(-1);
            string sqlStatement =
                string.Format(@"
                    SELECT  L.UpdateTime, L.Controller, L.Action, L.IP, 
                            U.RealName, U.UserName, AspNetUnits.UnitName,
                            L.Parameters,

							Case 
							When Action = 'Add' Then JSON_VALUE(L.Parameters, '$.FModel.Title') 
							When Action = 'Edit' Then JSON_VALUE(L.Parameters, '$.FModel.Title') 
                            When Action = 'EditApprove' Then JSON_VALUE(L.Parameters, '$.FModel.Title') 
                            When Action = 'EditLawyer' Then JSON_VALUE(L.Parameters, '$.FModel.Title') 
                            When Action = 'EditLawyerAdmin' Then JSON_VALUE(L.Parameters, '$.FModel.Title') 
                            When Action = 'Delete' Then JSON_VALUE(L.Parameters, '$.DataID') 
                            When Action = 'DownloadData' Then 'DownloadData' 
							Else L.Parameters
							End AS Content

                    FROM  tbl_ActionLog AS L LEFT JOIN
                            AspNetUsers AS U ON L.UserId = U.Id LEFT JOIN
                            AspNetUserUnits ON U.Id = AspNetUserUnits.UserId LEFT JOIN
                            AspNetUnits ON AspNetUserUnits.UnitID = AspNetUnits.UnitID
                    {0}
                    {1}
                    Offset @MinNum-1 Rows
                    Fetch Next @PageSize Rows Only ",
                    GetQueryString(Option), GetQuerySortString(Option));

            var result = defaultDB.Query<QueryActionLog>(sqlStatement, Option).ToList();
            return result;
        }

        /// <summary>
        /// 取得查詢結果的筆數
        /// </summary>
        /// <param name="Option"></param>
        /// <returns></returns>
        public int GetDataCount(ContentQueryOption Option)
        {
            Option.EndDate = Option.EndDate.AddDays(1).AddSeconds(-1);
            string sqlStatement =
                string.Format(
                    @"SELECT count(1)
                      FROM (
                            SELECT  L.UpdateTime
                            FROM     tbl_ActionLog AS L INNER JOIN
                                           AspNetUsers AS U ON L.UserId = U.Id INNER JOIN
                                           AspNetUserUnits ON U.Id = AspNetUserUnits.UserId INNER JOIN
                                           AspNetUnits ON AspNetUserUnits.UnitID = AspNetUnits.UnitID
                           {0}
						   ) AS t ", GetQueryString(Option));

            var result = defaultDB.ExecuteScalar<int>(sqlStatement, Option);

            return result;
        }

        /// <summary>
        /// 產生查詢條件
        /// </summary>
        /// <param name="Option"></param>
        /// <returns></returns>
        public string GetQueryString(ContentQueryOption Option)
        {
            switch (Option.FrontEnd)
            {
                case "0":
                    //後台
                    return GetQueryStringBackEnd(Option);
                case "1":
                default:
                    //前台
                    return "";//return GetQueryStringFrontEnd(Option);
            }

        }

        /// <summary>
        /// 供後台查詢介面使用
        /// </summary>
        /// <param name="Option"></param>
        /// <returns></returns>
        public string GetQueryStringBackEnd(ContentQueryOption Option)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("WHERE 1 = 1");
            sb.AppendFormat(" AND (UpdateTime BETWEEN @StartDate AND @EndDate)");

            if (string.IsNullOrEmpty(Option.UnitID) == false)
                sb.AppendFormat(" AND (AspNetUnits.UnitID = @UnitID)");

            if (string.IsNullOrEmpty(Option.RealName) == false)
                sb.AppendFormat(" AND (U.RealName LIKE '%' +  @RealName + '%')");

            return sb.ToString();
        }


        public string GetQuerySortString(ContentQueryOption Option)
        {
            StringBuilder sb = new StringBuilder();
            //Sort by 
            switch (Option.SortBy)
            {
                case "1":
                default:
                    sb.AppendFormat(" Order By UpdateTime Desc");
                    break;
                case "2":
                    sb.AppendFormat(" Order By UpdateTime");
                    break;
            }
            return sb.ToString();
        }

        #region 使用者查詢相關


        #endregion 使用者查詢相關

    }
}
