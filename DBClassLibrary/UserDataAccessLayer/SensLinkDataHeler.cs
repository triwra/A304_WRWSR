using DBClassLibrary.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBClassLibrary.UserDomainLayer.SensLinkModel;
using Dapper;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class SensLinkDataHeler : BaseRepository
    {
        /// <summary>
        /// 取得最新物理量數值 的名單
        /// </summary>
        /// <returns></returns>
        public List<PhysicalQuantityGetList> GetPhysicalQuantityGetList()
        {
            string sqlStatement =
                @"SELECT        PhysicalQuantityID, StationID
                  FROM        tbl_Senslink_PhysicalQuantityGetList";

            var sqlParams = new
            {

            };
            
            var result = defaultDB.Query<PhysicalQuantityGetList>(sqlStatement, sqlParams).ToList();
            return result;
        }

        /// <summary>
        /// 取得最新物理量數值 最新的日期
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public DateTime GetPhysicalQuantity_LatestDataTime(string Id)
        {
            string sqlStatement =
                @"SELECT        Id, TimeStamp
                    FROM           tbl_Senslink_PhysicalQuantity_LatestData
                    WHERE        (Id = @Id)
                    ORDER BY TimeStamp DESC ";

            var sqlParams = new
            {
                Id = Id
            };

            var result = defaultDB.Query<PhysicalQuantity_LatestData>(sqlStatement, sqlParams);
            if (result.FirstOrDefault() != null)
                return result.FirstOrDefault().TimeStamp;
            else
                return DateTime.MinValue;
        }



    }
}
