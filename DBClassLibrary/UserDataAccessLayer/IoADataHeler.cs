using Dapper;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer.IoAModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class IoADataHeler : BaseRepository
    {
        /// <summary>
        /// 取得要下載的觀測資料名單
        /// </summary>
        /// <param name="DeviceType">觀測設備種類</param>
        /// <returns></returns>
        public List<PhysicalQuantityGetList> GetSensorDeviceGetList(int Sensor_Device_Class_Code)
        {
            string sqlStatement =
                @"SELECT    Sensor_Device_SN, Sensor_Device_Class_Code, DownLoadStartDate
                    FROM    tbl_IoA_SensorDeviceGetList
                    WHERE   (Sensor_Device_Class_Code = @Sensor_Device_Class_Code)";

            var sqlParams = new
            {
                Sensor_Device_Class_Code = Sensor_Device_Class_Code
            };
            
            var result = defaultDB.Query<PhysicalQuantityGetList>(sqlStatement, sqlParams).ToList();
            return result;
        }

    }
}
