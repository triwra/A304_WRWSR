using Dapper;
using System;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer;
using System.Collections.Generic;
using System.Linq;


namespace DBClassLibrary.UserDataAccessLayer
{
    public class IrrigationHelper : BaseRepository
    {
        /// <summary>
        /// 回傳單一水庫即時資料
        /// </summary>
        /// <param name="StationNo"></param>
        /// <returns></returns>
        public List<CropIrrigationData> GetIrrigationCropArea(int year)
        {
            string sqlStatement =
                @"select s1.IAName  as IrrigationName,s1.IANo  as IrrigationID, s2.CropArea as CropArea, s2.color as color
, s1.Longitude as Longitude, s1.Latitude as Latitude from 
(select distinct iano, IAName, avg(Longitude) as Longitude, avg(Latitude)  as Latitude from tbl_IAStation group by iano, IAName) s1 
                left join 
                (select FLOOR(sum(t1.CalcArea)/10000) as CropArea, 
             CASE   
                  WHEN FLOOR(sum(t1.CalcArea)/10000) <= 2500 THEN 1
                  WHEN FLOOR(sum(t1.CalcArea)/10000) > 2500 and  FLOOR(sum(t1.CalcArea)/10000) <=5000 THEN 2   
	              WHEN FLOOR(sum(t1.CalcArea)/10000) > 5000 and  FLOOR(sum(t1.CalcArea)/10000) <=7500 THEN 3   
	              WHEN FLOOR(sum(t1.CalcArea)/10000) > 7500 and  FLOOR(sum(t1.CalcArea)/10000) <=10000 THEN 4   
	              WHEN FLOOR(sum(t1.CalcArea)/10000) > 10000 and  FLOOR(sum(t1.CalcArea)/10000) <=12500 THEN 5   
	              WHEN FLOOR(sum(t1.CalcArea)/10000) > 12500  THEN 6   
               END    as color,
               t2.IANo as IrrigationID,
                t1.DataYear as  IrrigationYear, avg(t2.Longitude) as Longitude, avg(t2.Latitude) as Latitude
             
               from tbl_CropAreaData_History t1
                join tbl_IAStation  t2 on t1.WorkStationId=t2.WorkStationId

                where  t1.DataYear=(select top (1) DataYear from tbl_CropAreaData_History  order by DataYear desc)
                and t1.CropType='TR'
                and t1.PeriodNo=(select top (1) PeriodNo from tbl_CropAreaData_History 
               where DataYear=(select top (1) DataYear from tbl_CropAreaData_History  order by DataYear desc) order by PeriodNo desc)
                group by  t2.IANo, t2.IAName, t1.DataYear ) s2
				on s1.IANo=s2.IrrigationID
                order by s2.IrrigationYear, s1.IANo, s1.Latitude, s1.Longitude";

      
            var result = defaultDB.Query<CropIrrigationData>(sqlStatement);

            return result.ToList();
        }

        public List<CropIrrigationData> GetIrrigation5Years(int year)
        {
            string sqlStatement =
                @"select s1.IAName  as IrrigationName,s1.IANo  as IrrigationID, s2.CropArea as CropArea
, s3.Longitude as Longitude, s3.Latitude as Latitude from 
(select distinct iano, IAName from tbl_IAStation) s1 
left join 
(select IrrigationID, IrrigationName, FLOOR(avg(CropArea)) as CropArea from
(select FLOOR(sum(t1.CalcArea)/10000) as CropArea, 
             CASE   
                  WHEN FLOOR(sum(t1.CalcArea)/10000) <= 2500 THEN 1
                  WHEN FLOOR(sum(t1.CalcArea)/10000) > 2500 and  FLOOR(sum(t1.CalcArea)/10000) <=5000 THEN 2   
	              WHEN FLOOR(sum(t1.CalcArea)/10000) > 5000 and  FLOOR(sum(t1.CalcArea)/10000) <=7500 THEN 3   
	              WHEN FLOOR(sum(t1.CalcArea)/10000) > 7500 and  FLOOR(sum(t1.CalcArea)/10000) <=10000 THEN 4   
	              WHEN FLOOR(sum(t1.CalcArea)/10000) > 10000 and  FLOOR(sum(t1.CalcArea)/10000) <=12500 THEN 5   
	              WHEN FLOOR(sum(t1.CalcArea)/10000) > 12500  THEN 6   
               END    as color,
               t2.IANo as IrrigationID, t2.IAName as IrrigationName, 
                t1.DataYear as  IrrigationYear
             
               from tbl_CropAreaData_History t1
                join tbl_IAStation  t2 on t1.WorkStationId=t2.WorkStationId

                where  t1.DataYear<=(select top (1) DataYear from tbl_CropAreaData_History  order by DataYear desc )
				and  t1.DataYear>(select top (1) DataYear from tbl_CropAreaData_History  order by DataYear desc)-10
                and t1.CropType='TR'
                and t1.PeriodNo=(select top (1) PeriodNo from tbl_CropAreaData_History 
               where DataYear=(select top (1) DataYear from tbl_CropAreaData_History  order by DataYear desc) order by PeriodNo desc)
                group by  t2.IANo, t2.IAName, t1.DataYear 
                -- order by t1.DataYear,  t2.IANo
				) s group by IrrigationID,IrrigationName) s2
				on s1.IANo=s2.IrrigationID
join tbl_IrrigationAssn s3 on s1.IANo=s3.IANo
                order by s1.IANo";


            var result = defaultDB.Query<CropIrrigationData>(sqlStatement);

            return result.ToList();
        }
        
            public List<CropIrrigationData> GetAllYearAreaByIrrigation(int irrigationYear, string irrigationID, string periodData)
        {
            string sqlStatement =
                @"select FLOOR(sum(t1.CalcArea)/10000) as CropArea, 
             CASE   
                  WHEN FLOOR(sum(t1.CalcArea)/10000) <= 2500 THEN 1
                  WHEN FLOOR(sum(t1.CalcArea)/10000) > 2500 and  FLOOR(sum(t1.CalcArea)/10000) <=5000 THEN 2   
	              WHEN FLOOR(sum(t1.CalcArea)/10000) > 5000 and  FLOOR(sum(t1.CalcArea)/10000) <=7500 THEN 3   
	              WHEN FLOOR(sum(t1.CalcArea)/10000) > 7500 and  FLOOR(sum(t1.CalcArea)/10000) <=10000 THEN 4   
	              WHEN FLOOR(sum(t1.CalcArea)/10000) > 10000 and  FLOOR(sum(t1.CalcArea)/10000) <=12500 THEN 5   
	              WHEN FLOOR(sum(t1.CalcArea)/10000) > 12500  THEN 6   
               END    as color,
               t2.IANo as IrrigationID, t2.IAName as IrrigationName, 
                t1.DataYear as  IrrigationYear
             
               from tbl_CropAreaData_History t1
                join tbl_IAStation  t2 on t1.WorkStationId=t2.WorkStationId
                where 
                 t1.CropType='TR' and t1.DataYear<=@irrigationYear
                and t1.PeriodNo=@PeriodNo
				and t2.IANo=@IANo
                group by  t2.IANo, t2.IAName, t1.DataYear 
                order by t2.IANo, t1.DataYear ";


            var result = defaultDB.Query<CropIrrigationData>(sqlStatement, new { irrigationYear = irrigationYear, IANO = irrigationID, PeriodNo = periodData }) ;  

            return result.ToList();
        }

        
        public CropIrrigationData GetLocationByIrrigation(string irrigationID)
        {
            string sqlStatement =
                @"select  Longitude,  Latitude from tbl_IrrigationAssn where IANo=@IANo";

            var result = defaultDB.QueryFirstOrDefault<CropIrrigationData>(sqlStatement, new { IANO = irrigationID }); ;

            return result;
        }

        public List<IrragarionYearData> GetIrrigationYearList()
        {
            string sqlStatement =
                @"SELECT distinct
                     DataYear as IrrigationYear
                  FROM tbl_CropAreaData_History order by DataYear ASC";

            var result = defaultDB.Query<IrragarionYearData>(sqlStatement); ;
            return result.ToList();
        }

        public List<IrragarionGeoData> GetIrrigationGeoData(int irrigationYear, string irrigationID, string periodData)
        {
            string sqlStatement =
                string.Format(@" SELECT  dbo.geomToGeoJSON([Geometry].MakeValid()) as geometry
                  FROM [tbl_CropAreaData_History]
                  where WorkStationId like {0} and DataYear=@irrigationYear and PeriodNo=@PeriodNo
               ", "'"+ irrigationID + "%'");

            var result = defaultDB.Query<IrragarionGeoData>(sqlStatement, new { irrigationYear = irrigationYear, IANO = irrigationID, PeriodNo = periodData }); 
            return result.ToList();
        }

        public IrragarionGeoData GetCityGeoData(string irrigationID)
        {
            string sqlStatement =
                string.Format(@" SELECT  dbo.geomToGeoJSON([Geometry].MakeValid()) as geometry
                  FROM [tbl_GeomIrrigationAssn]
                  where IANo=@IANo
               ");
            sqlStatement =
               string.Format(@" SELECT  GeomJson as geometry
                  FROM [tbl_GeomIrrigationAssn]
                  where IANo=@IANo
               ");
            var result = defaultDB.QueryFirstOrDefault<IrragarionGeoData>(sqlStatement, new { IANO = irrigationID });
            return result;
        }

        public IrragarionDataDate GetDataDateByIrrigation(int irrigationYear, string irrigationID, string periodData)
        {
            string sqlStatement =
                string.Format(@" SELECT  convert(varchar, max(DataDate), 23)  as dataDate
                  FROM [tbl_CropAreaData_History]
                  where WorkStationId like {0} and DataYear=@irrigationYear and PeriodNo=@PeriodNo
                
               ", "'" + irrigationID + "%'");

            var result = defaultDB.QueryFirstOrDefault<IrragarionDataDate>(sqlStatement, new { irrigationYear = irrigationYear, IANO = irrigationID, PeriodNo = periodData });
            return result;
        }
    }
}
