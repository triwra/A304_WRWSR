using Dapper;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer;
using DBClassLibrary.UserDomainLayer.RainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using static DBClassLibrary.UserDomainLayer.CWBModel.AutomaticStationList;
using static DBClassLibrary.UserDomainLayer.IrrigationPlanModel;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class IrrigationPlanDataHelper : BaseRepository
    {
        /// <summary>
        /// 取得灌溉用水年度列表
        /// </summary>
        /// <returns></returns>
        public List<IrrigationPlanModel.YearList> GetIrrigationPlanDataYearList()
        {
            //string sqlStatement =
            //    @"
            //        SELECT distinct(YEAR(PlanDate)) as Year
            //        FROM vwIrrigationPlanManageData  ORDER BY Year desc
            //    ";
            string sqlStatement =
                @"
                    SELECT distinct(YEAR(PlanDate)) as Year
                    FROM tbl_IrrigationPlanManageData
                    ORDER BY Year Desc
                ";

            var result = defaultDB.Query<IrrigationPlanModel.YearList>(sqlStatement);
            return result.ToList();
        }

        /// <summary>
        /// 取得灌溉用水年度列表(民國年)
        /// </summary>
        /// <returns></returns>
        public List<IrrigationPlanModel.YearList> GetIrrigationPlanDataROCYearList()
        {
            string sqlStatement =
                @"
                    SELECT distinct(YEAR(PlanDate)) as Year
                    FROM tbl_IrrigationPlanManageData
                    ORDER BY Year Desc
                ";

            var result = defaultDB.Query<IrrigationPlanModel.YearList>(sqlStatement);

            //轉為民國年
            foreach (var item in result)            
                item.Year = item.Year - 1911;            

            return result.ToList();
        }

        /// <summary>
        /// 取得灌溉用水計劃管理區資料
        /// </summary>
        /// <param name="DataYear"></param>
        /// <param name="PeriodNo"></param>
        /// <param name="CropType"></param>
        /// <param name="IANo"></param>
        /// <returns></returns>
        public List<IrrigationPlanManageDataByTendays> QueryIrrigationPlanManageDataByTendays
            (int DataYear, int PeriodNo, string CropType, string IANo)
        {
            string sqlStatement =
                string.Format(@"

                SELECT * FROM 
                (
                    SELECT       I.ManageName AS SystemName, D.ManageID AS GroupNo, 
			                    'T' + CAST(dbo.ufn_PeriodOfYear(D.PlanDate) AS varchar(2)) AS PeriodOfYear,                                 
			                    SUM(D.FieldArea) AS FieldArea, SUM(D.PlanTotal) AS PlanTotal
                    FROM           tbl_IrrigationPlanManageData AS D INNER JOIN
                                         tbl_IrrigationPlanManageInfo AS I ON D.ManageID = I.ManageID
                    WHERE       
                                (D.CropType = @CropType) 
                            AND (YEAR(D.PlanDate) = @DataYear) 
                            AND (D.PeriodNo = @PeriodNo)
                            AND (D.IANo = @IANo)
                    GROUP BY  dbo.ufn_PeriodOfYear(D.PlanDate), D.ManageID, I.ManageName
                ) AS X
                PIVOT
                (
                    SUM(PlanTotal)
                    FOR PeriodOfYear IN 
                    ([T1],[T2],[T3],[T4],[T5],[T6],[T7],[T8],[T9],[T10],[T11],
                    [T12],[T13],[T14],[T15],[T16],[T17],[T18],[T19],[T20],[T21],
                    [T22],[T23],[T24],[T25],
                    [T26],[T27],[T28],[T29],[T30],[T31],[T32],[T33],[T34],[T35],[T36])
                ) AS PVT
                Order by GroupNo

                ");

            var result = defaultDB.Query<IrrigationPlanModel.IrrigationPlanManageDataByTendays>(
                sqlStatement,
                new
                {
                    DataYear = DataYear + 1911, //民國轉為西元年
                    CropType = CropType,
                    PeriodNo = PeriodNo,
                    IANo = IANo
                });

            return result.ToList();
        }

        /// <summary>
        /// 取得民生工業用水年度列表
        /// </summary>
        /// <returns></returns>
        public List<IrrigationPlanModel.YearList> GetPublicUseOfWaterYearList()
        {
            string sqlStatement =
                @"
                    SELECT  distinct(YEAR(SupplyDate)) as Year
                    FROM    tbl_PublicUseOfWater
                    ORDER BY Year Desc
                ";

            var result = defaultDB.Query<IrrigationPlanModel.YearList>(sqlStatement);
            return result.ToList();
        }

        /// <summary>
        /// 取得灌溉支線渠道資料
        /// </summary>
        /// <returns></returns>
        public List<IrrigationPlanModel.IrrigationCanalInfo> GetIrrigationCanalInfoList()
        {
            string sqlStatement =
                @"
                    SELECT         CanalID, CanalName, SysID, AreaID, GroupNo
                    FROM           tbl_IrrigationCanalInfo
                    Order By CanalID
                ";

            var result = defaultDB.Query<IrrigationPlanModel.IrrigationCanalInfo>(sqlStatement);

            return result.ToList();
        }

        /// <summary>
        /// 取得灌溉區域資料
        /// </summary>
        /// <returns></returns>
        public List<IrrigationPlanModel.IrrigationAreaInfo> GetIrrigationAreaInfoList()
        {
            string sqlStatement =
                @"
                    SELECT         AreaID, AreaName
                    FROM           tbl_IrrigationAreaInfo
                    Order By AreaID
                ";

            var result = defaultDB.Query<IrrigationPlanModel.IrrigationAreaInfo>(sqlStatement);

            return result.ToList();
        }

        /// <summary>
        /// 取得灌溉區域資料(只回傳有設定雨量站權重的灌區)
        /// </summary>
        /// <returns></returns>
        public List<IrrigationPlanModel.IrrigationAreaInfo> GetIrrigationAreaInfoWithWeightList()
        {
            string sqlStatement =
                @"
                    SELECT        Info.AreaID, Info.AreaName
                    FROM           tbl_IrrigationAreaInfo AS Info INNER JOIN
                                         tbl_RainStationWeightList AS W ON Info.AreaID = W.AreaID
                    GROUP BY  Info.AreaID, Info.AreaName
                    ORDER BY  Info.AreaID
                ";

            var result = defaultDB.Query<IrrigationPlanModel.IrrigationAreaInfo>(sqlStatement);

            return result.ToList();
        }

        /// <summary>
        /// 取得灌溉區域資料(只回傳有設定雨量站即時權重的灌區)
        /// </summary>
        /// <returns></returns>
        public List<IrrigationPlanModel.IrrigationAreaInfo> GetIrrigationAreaInfoWithRealTimeWeightList()
        {
            /*
              string sqlStatement =
                @"
                    SELECT        Info.AreaID, Info.AreaName
                    FROM           tbl_IrrigationAreaInfo AS Info INNER JOIN
                                         tbl_RainStationRealTimeWeightList AS W ON Info.AreaID = W.AreaID
                    GROUP BY  Info.AreaID, Info.AreaName
                    ORDER BY  Info.AreaID
                ";
            */
            string sqlStatement =
               @"
                    SELECT        Info.IANo as AreaID, Info.Name as AreaName
                    FROM         [tbl_IrrigationAssn] Info
                    ORDER BY  Info.IANo
                ";
            var result = defaultDB.Query<IrrigationPlanModel.IrrigationAreaInfo>(sqlStatement);

            return result.ToList();
        }

        /// <summary>
        /// 取得灌溉用水資料 (數值由CMS轉為萬噸)
        /// </summary>
        /// <returns></returns>
        public List<IrrigationPlanModel.IrrigationPlanData> QueryIrrigationPlanData
            (DateTime StartDate, DateTime EndDate)
        {
            string strWhereCondition = string.Empty;
            string sqlStatement =
                string.Format(@"
                    SELECT      PlanDate, CanalID, CropType, Irrig_Field, PeriodNo, CropCount, 
                                CropGrowState, FieldArea, Rate, 

                                Cast(PlanField as decimal(14,4)) as PlanField,
                                Cast(PlanGate as decimal(14,4)) as PlanGate,
                                Cast(PlanLoss as decimal(14,4)) as PlanLoss,
                                Cast(PlanTotal as decimal(14,4)) as PlanTotal,

                                Cast(ProofGate as decimal(14,4)) as ProofGate,
                                Cast(ProofLoss as decimal(14,4)) as ProofLoss,
                                Cast(ProofTotal as decimal(14,4)) as ProofTotal,

                                Cast(RealGate as decimal(14,4)) as RealGate,
                                Cast(RealLoss as decimal(14,4)) as RealLoss,
                                Cast(RealTotal as decimal(14,4)) as RealTotal,

                                Cast(CanalAdiust as decimal(14,4)) as CanalAdiust,
                                Cast(CanalAdiustDelt as decimal(14,4)) as CanalAdiustDelt

                    FROM           tbl_IrrigationPlanData
                    WHERE       PlanDate Between @StartDate And @EndDate
                    Order By PlanDate asc
                ", strWhereCondition);

            var result = defaultDB.Query<IrrigationPlanModel.IrrigationPlanData>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate
                });

            return result.ToList();
        }

        /// <summary>
        /// 取得灌溉用水計劃管理區資料 (數值由CMS轉為萬噸)
        /// </summary>
        /// <returns></returns>
        public List<IrrigationPlanModel.IrrigationPlanManageData> QueryIrrigationPlanManageData
            (DateTime StartDate, DateTime EndDate)
        {
            string strWhereCondition = string.Empty;
            string sqlStatement =
                string.Format(@"
                    SELECT      PlanDate, ManageID, CropType, Irrig_Field, PeriodNo, CropCount, 
                                CropGrowState, FieldArea, Rate, 
                                Cast(PlanField * 86400 / 10000 as decimal(14,4)) as PlanField,
                                Cast(PlanTotal * 86400 / 10000 as decimal(14,4)) as PlanTotal,
                                Cast(ProofTotal * 86400 / 10000 as decimal(14,4)) as ProofTotal,
                                Cast(RealTotal * 86400 / 10000 as decimal(14,4)) as RealTotal,
                                Cast(CanalAdiust * 86400 / 10000 as decimal(14,4)) as CanalAdiust,
                                Cast(CanalAdiustDelt * 86400 / 10000 as decimal(14,4)) as CanalAdiustDelt
                    FROM           tbl_IrrigationPlanManageData
                    WHERE       PlanDate Between @StartDate And @EndDate
                    Order By PlanDate asc
                ", strWhereCondition);

            var result = defaultDB.Query<IrrigationPlanModel.IrrigationPlanManageData>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate
                });

            return result.ToList();
        }

        /// <summary>
        /// 取得民生公共及工業用水資料 (數值由CMS轉為萬噸)
        /// </summary>
        /// <param name="StartDate"></param>
        /// <param name="EndDate"></param>
        /// <param name="SupplyType"></param>
        /// <returns></returns>
        public List<PublicUseOfWater.PublicUseOfWaterData> QueryPublicUseOfWater
            (DateTime StartDate, DateTime EndDate, PublicUseOfWater.SupplyType SupplyType)
        {
            string strWhereCondition = string.Empty;
            string sqlStatement =
                string.Format(@"
                    SELECT      SupplyDate, SupplyType,
                                Cast(PlanTotal  as decimal(14,4)) as PlanTotal,
                                Cast(ProofTotal  as decimal(14,4)) as ProofTotal,
                                Cast(RealTotal  as decimal(14,4)) as RealTotal,
                                Cast(CanalAdiust  as decimal(14,4)) as CanalAdiust,
                                Cast(CanalAdiustDelt as decimal(14,4)) as CanalAdiustDelt
                    FROM           tbl_PublicUseOfWater
                    WHERE       SupplyDate Between @StartDate And @EndDate
                            And SupplyType = @SupplyType
                    Order By SupplyDate ASC
                ", strWhereCondition);

            var result = defaultDB.Query<PublicUseOfWater.PublicUseOfWaterData>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate,
                    SupplyType = SupplyType.ToString()
                });

            return result.ToList();
        }

        #region 前台查資料用

        #region 時間序列資料
        public List<IrrigationPlanModel.IrrigationPlanData> GetIrrigationPlanTimeSeriesData
        (string StartDate, string EndDate, string[] TR1Area, string[] TR2Area, string[] TSTMArry)
        {
            string cond1 = string.Empty;
            string cond2 = string.Empty;
            string cond3 = string.Empty;
            string cond4 = string.Empty; //FOR GROUP CONDITION

            if (TR1Area.Length == 0)
            {
                cond1 = "(CropType+'-'+CONVERT(varchar(10), PeriodNo) = 'TR-1' AND AreaID_1 not in ('0')) AND (CropType + '-' + CONVERT(varchar(10), PeriodNo) = 'TR-1' AND AreaID_2 not in ('0'))";
            }
            else
            {
                cond1 = "(CropType+'-'+CONVERT(varchar(10), PeriodNo) = 'TR-1' AND AreaID_1 not in  @TR1Area) AND (CropType + '-' + CONVERT(varchar(10), PeriodNo) = 'TR-1' AND AreaID_2 not in  @TR1Area)";
            }
            if (TR2Area.Length == 0)
            {
                cond2 = "(CropType+'-'+CONVERT(varchar(10), PeriodNo) = 'TR-2' AND AreaID_1 not in ('0')) AND (CropType + '-' + CONVERT(varchar(10), PeriodNo) = 'TR-2' AND AreaID_2 not in ('0'))";
            }
            else
            {
                cond2 = "(CropType+'-'+CONVERT(varchar(10), PeriodNo) = 'TR-2' AND AreaID_1 not in  @TR2Area) AND (CropType + '-' + CONVERT(varchar(10), PeriodNo) = 'TR-2' AND AreaID_2 not in @TR2Area)";
            }
            if (TSTMArry.Length == 0) cond3 = "(CropType+'-'+CONVERT(varchar(10), CropCount) not in ('TM-0')) ";
            else cond3 = "(CropType+'-'+CONVERT(varchar(10), CropCount) not in @TSTMArry) ";

            string sqlStatement =
                string.Format(@"
                         Select PlanDate
	                        , Cast(SUM(PlanField) as decimal(14,4)) AS PlanField 
	                        , Cast(SUM(PlanGate) as decimal(14,4)) AS PlanGate 
	                        , Cast(SUM(PlanLoss) as decimal(14,4)) AS PlanLoss 
	                        , Cast(SUM(PlanTotal) as decimal(14,4)) AS PlanTotal 
	                        , Cast(SUM(ProofGate) as decimal(14,4)) AS ProofGate
	                        , Cast(SUM(ProofLoss) as decimal(14,4)) AS ProofLoss
	                        , Cast(SUM(ProofTotal) as decimal(14,4)) AS ProofTotal
	                        , Cast(SUM(RealGate) as decimal(14,4)) AS RealGate
	                        , Cast(SUM(RealLoss) as decimal(14,4)) AS RealLoss
	                        , Cast(SUM(RealTotal) as decimal(14,4)) AS RealTotal
	                        , Cast(SUM(CanalAdiust) as decimal(14,4)) AS CanalAdiust
	                        , Cast(SUM(CanalAdiustDelt) as decimal(14,4)) AS CanalAdiustDelt
                        FROM(
	                        SELECT * FROM
	                        (
		                        SELECT  PlanDate
			                        ,tbl_Sys.SysID, tbl_Sys.SysName
			                        ,SUBSTRING(CONVERT(varchar(10), tbl_Area.AreaID),1,1) AS AreaID_1
			                        ,SUBSTRING(CONVERT(varchar(10), tbl_Area.AreaID),2,1) AS AreaID_2
			                        ,tbl_Area.AreaName
			                        ,tbl_Canal.CanalID, tbl_Canal.CanalName
			                        ,SUBSTRING(CONVERT(varchar(10), tbl_Canal.GroupNo),1,1) AS GroupNo_1
			                        ,SUBSTRING(CONVERT(varchar(10), tbl_Canal.GroupNo),2,1) AS GroupNo_2
			                        ,CropType ,Irrig_Field ,PeriodNo ,CropCount
			                        ,CropGrowState ,FieldArea ,Rate
			                        ,PlanField ,PlanGate ,PlanLoss ,PlanTotal
			                        ,ProofGate ,ProofLoss ,ProofTotal
			                        ,RealGate ,RealLoss ,RealTotal
			                        ,CanalAdiust ,CanalAdiustDelt
		                        FROM [tbl_IrrigationPlanManageData] AS tbl_data
		                        LEFT JOIN tbl_IrrigationCanalInfo AS tbl_Canal ON tbl_data.CanalID = tbl_Canal.CanalID
		                        LEFT JOIN tbl_IrrigationAreaInfo AS tbl_Area ON tbl_Canal.AreaID = tbl_Area.AreaID
		                        LEFT JOIN tbl_IrrigationSysInfo AS tbl_Sys ON tbl_Canal.SysID  = tbl_Sys.SysID
	                        ) AS t2
                            WHERE 
                            (
                                (
	                                (
		                                {0}
	                                ) OR
	                                (
                                        {1}
	                                )
                                ) OR 
                                (
		                            (GroupNo_1 is null OR GroupNo_1 not in ('0')) AND
		                            (GroupNo_2 is null OR GroupNo_2 not in ('0'))
	                            )OR 
                                    {2} 
                            )
                            AND ( PlanDate between @StartDate AND @EndDate )
                    ) AS t1
                    GROUP BY PlanDate
                    ORDER BY PlanDate
                ", cond1, cond2, cond3);

            var result = defaultDB.Query<IrrigationPlanModel.IrrigationPlanData>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate,
                    TR1Area = TR1Area,
                    TR2Area = TR2Area,
                    TSTMArry = TSTMArry
                });

            return result.ToList();
        }

        public List<IrrigationPlanModel.IrrigationPlanData> GetIrrigationPlanMngTimeSeriesData_old
        (string StartDate, string EndDate, string[] TR1Area, string[] TR2Area, string[] TSTMArry, string[] DelayMDDateList)
        {
            string cond1 = string.Empty;
            string cond2 = string.Empty;
            string cond3 = string.Empty;
            string cond4 = string.Empty; //FOR GROUP CONDITION
            string _Period1DelayMDDate = DelayMDDateList[0];
            string _Group1DelayMDDate = DelayMDDateList[1];
            string _Group2DelayMDDate = DelayMDDateList[2];
            string _Group3DelayMDDate = DelayMDDateList[3];
            string _Group4DelayMDDate = DelayMDDateList[4];
            string _Group5DelayMDDate = DelayMDDateList[5];
            string _Group6DelayMDDate = DelayMDDateList[6];

            if (TR1Area.Length == 0)
            {
                //cond1 = "(CropType+'-'+CONVERT(varchar(10), PeriodNo) != 'TR-1' OR AreaID_1 not in ('0')) AND" +
                //        " (CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-1' OR AreaID_2 not in ('0'))";

                cond1 = "(CropType+'-'+CONVERT(varchar(10), PeriodNo) != 'TR-1' OR AreaID_1 not in ('0')) ";
            }
            else
            {
                if (TR1Area[0] != "0")
                {
                    List<string> list = new List<string>();
                    list = TR1Area.ToList();
                    list.Add("9");
                    TR1Area = list.ToArray();
                }
                //cond1 = "(CropType+'-'+CONVERT(varchar(10), PeriodNo) != 'TR-1' OR AreaID_1 not in  @TR1Area) AND " +
                //        "(CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-1' OR AreaID_2 not in  @TR1Area)";
                cond1 = "(CropType+'-'+CONVERT(varchar(10), PeriodNo) != 'TR-1' OR AreaID_1 not in  @TR1Area) ";
            }
            if (TR2Area.Length == 0)
            {
                //cond2 = "(CropType+'-'+CONVERT(varchar(10), PeriodNo) != 'TR-2' OR AreaID_1 not in ('0')) AND " +
                //        "(CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-2' OR AreaID_2 not in ('0'))";
                cond2 = "(CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-2' OR GroupNum not in ('0'))";
            }
            else
            {
                if (TR2Area[0] != "0")
                {
                    List<string> list = new List<string>();
                    list = TR2Area.ToList();
                    list.Add("9");
                    TR2Area = list.ToArray();
                }
                //cond2 = "(CropType+'-'+CONVERT(varchar(10), PeriodNo) != 'TR-2' OR AreaID_1 not in  @TR2Area) AND" +
                //        " (CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-2' OR AreaID_2 not in @TR2Area)";
                cond2 = "(CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-2' OR GroupNum not in @TR2Area)";
            }
            if (TSTMArry.Length == 0)
            {
                cond3 = "(CropCount is null) OR (CropType+'-'+CONVERT(varchar(10), CropCount) not in ('TM-0')) ";
            }
            else
            {
                if (TSTMArry[0] != "TM-0")
                {
                    List<string> CropCountList = new List<string>();
                    for (int i = 0; i < TSTMArry.Length; i++)
                    {
                        CropCountList.Add(TSTMArry[i].Split('-')[1]);
                    }
                    CropCountList = CropCountList.Distinct().ToList();
                    List<string> list = new List<string>();
                    list = TSTMArry.ToList();
                    for (int i = 0; i < CropCountList.Count; i++)
                    {
                        list.Add("TL-" + CropCountList[i]);
                    }
                    TSTMArry = list.ToArray();
                }
                cond3 = "(CropCount is null) OR (CropType+'-'+CONVERT(varchar(10), CropCount) not in @TSTMArry) ";
            }

            string sqlStatement =
                string.Format(@"
                    with tbl AS(
                        SELECT  PlanDate,GroupNum
	                        ,SysID, SysName
	                        ,SUBSTRING(CONVERT(varchar(10), AreaID),1,1) AS AreaID_1
	                        ,SUBSTRING(CONVERT(varchar(10), AreaID),2,1) AS AreaID_2
	                        ,AreaName
	                        ,SUBSTRING(CONVERT(varchar(10), GroupNo),1,1) AS GroupNo_1
	                        ,SUBSTRING(CONVERT(varchar(10), GroupNo),2,1) AS GroupNo_2
	                        ,CropType ,PeriodNo ,CropCount
	                        ,PlanTotal,ProofTotal,RealTotal
	                        ,CanalAdiust ,CanalAdiustDelt
	                        --, CropType+'-'+CONVERT(varchar(10), CropCount)  AS AAA
	                        --,(CropType+'-'+CONVERT(varchar(10), PeriodNo))AS  BBB
	                        FROM vwIrrigationPlanManageData
	                        WHERE ( PlanDate between @StartDate AND @EndDate )
                        )	
                
                         Select PlanDate
	                        , Cast(SUM(PlanTotal) as decimal(14,4)) AS PlanTotal 
	                        , Cast(SUM(ProofTotal) as decimal(14,4)) AS ProofTotal
	                        , Cast(SUM(RealTotal) as decimal(14,4)) AS RealTotal
	                        , Cast(SUM(CanalAdiust) as decimal(14,4)) AS CanalAdiust
	                        , Cast(SUM(CanalAdiustDelt) as decimal(14,4)) AS CanalAdiustDelt
                        FROM(
	                        SELECT * FROM (
								SELECT *FROM(
									SELECT * FROM 
									(
										SELECT PlanDate,GroupNum, SysID,SysName,AreaID_1,AreaID_2,AreaName
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE GroupNum is null  AND CropType != 'TR'
										UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetPeriod1DelayDays(@StratYear,@Period1DelayMDDate)), PlanDate)PlanDate,GroupNum, SysID,SysName,AreaID_1,AreaID_2,AreaName
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE GroupNum is null AND CropType = 'TR'
										UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetPeriod2GroupDelayDays(@StratYear,@Group1DelayMDDate,1)), PlanDate)PlanDate,GroupNum, SysID,SysName,AreaID_1,AreaID_2,AreaName
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE GroupNum is not null AND GroupNum = 1 
											UNION ALL
										SELECT DATEADD(DAY,(Select * FROM GetPeriod2GroupDelayDays(@StratYear,@Group2DelayMDDate,2)), PlanDate)PlanDate,GroupNum, SysID,SysName,AreaID_1,AreaID_2,AreaName
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE GroupNum is not null AND GroupNum = 2 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetPeriod2GroupDelayDays(@StratYear,@Group3DelayMDDate,3)), PlanDate)PlanDate,GroupNum, SysID,SysName,AreaID_1,AreaID_2,AreaName
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE GroupNum is not null AND GroupNum = 3 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetPeriod2GroupDelayDays(@StratYear,@Group4DelayMDDate,4)), PlanDate)PlanDate,GroupNum, SysID,SysName,AreaID_1,AreaID_2,AreaName
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE GroupNum is not null AND GroupNum = 4 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetPeriod2GroupDelayDays(@StratYear,@Group5DelayMDDate,5)), PlanDate)PlanDate,GroupNum, SysID,SysName,AreaID_1,AreaID_2,AreaName
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE GroupNum is not null AND GroupNum = 5 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetPeriod2GroupDelayDays(@StratYear,@Group6DelayMDDate,6)), PlanDate)PlanDate,GroupNum, SysID,SysName,AreaID_1,AreaID_2,AreaName
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE GroupNum is not null AND GroupNum = 6 										
									)AS temp1
									WHERE {2}
								) AS temp2
								WHERE　
								(
									(GroupNo_1 is null OR GroupNo_1 not in ('0')) AND
									(GroupNo_2 is null OR GroupNo_2 not in ('0'))
								)
							)AS temp3
							WHERE
							(
								{0}
								AND
								{1}
							)
                    ) AS t1
                    GROUP BY PlanDate
                    ORDER BY PlanDate
                ", cond1, cond2, cond3);

            var result = defaultDB.Query<IrrigationPlanModel.IrrigationPlanData>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate,
                    TR1Area = TR1Area,
                    TR2Area = TR2Area,
                    TSTMArry = TSTMArry,
                    StratYear = StartDate.Split('-')[0],
                    Period1DelayMDDate = _Period1DelayMDDate,
                    Group1DelayMDDate = _Group1DelayMDDate,
                    Group2DelayMDDate = _Group2DelayMDDate,
                    Group3DelayMDDate = _Group3DelayMDDate,
                    Group4DelayMDDate = _Group4DelayMDDate,
                    Group5DelayMDDate = _Group5DelayMDDate,
                    Group6DelayMDDate = _Group6DelayMDDate
                });

            return result.ToList();
        }



        public List<IrrigationPlanModel.IrrigationPlanData> GetIrrigationPlanMngTimeSeriesData
    (string StartDate, string EndDate, string[] ManageID, string[] DelayMDDateList1, string[] DelayMDDateList2)
        {
            string _P1Group1DelayMDDate = DelayMDDateList1[1];
            string _P1Group2DelayMDDate = DelayMDDateList1[2];
            string _P1Group3DelayMDDate = DelayMDDateList1[3];
            string _P1Group4DelayMDDate = DelayMDDateList1[4];
            string _P1Group5DelayMDDate = DelayMDDateList1[5];
            string _P1Group6DelayMDDate = DelayMDDateList1[6];
            string _P2Group1DelayMDDate = DelayMDDateList2[1];
            string _P2Group2DelayMDDate = DelayMDDateList2[2];
            string _P2Group3DelayMDDate = DelayMDDateList2[3];
            string _P2Group4DelayMDDate = DelayMDDateList2[4];
            string _P2Group5DelayMDDate = DelayMDDateList2[5];
            string _P2Group6DelayMDDate = DelayMDDateList2[6];

            string sqlStatement =
                string.Format(@"
                    with tbl AS(
                        SELECT  PlanDate,GroupNum,ManageID
	                        ,SUBSTRING(CONVERT(varchar(10), GroupNo),1,1) AS GroupNo_1
	                        ,SUBSTRING(CONVERT(varchar(10), GroupNo),2,1) AS GroupNo_2
	                        ,CropType ,PeriodNo ,CropCount
	                        ,PlanTotal,ProofTotal,RealTotal
	                        ,CanalAdiust ,CanalAdiustDelt
	                        FROM vwIrrigationPlanManageData
	                        WHERE ( PlanDate between @StartDate AND @EndDate) AND ManageID not in @ManageID
                        )	
                
                         Select PlanDate
	                        , Cast(SUM(PlanTotal) as decimal(14,4)) AS PlanTotal 
	                        , Cast(SUM(ProofTotal) as decimal(14,4)) AS ProofTotal
	                        , Cast(SUM(RealTotal) as decimal(14,4)) AS RealTotal
	                        , Cast(SUM(CanalAdiust) as decimal(14,4)) AS CanalAdiust
	                        , Cast(SUM(CanalAdiustDelt) as decimal(14,4)) AS CanalAdiustDelt
                        FROM(
	                        SELECT * FROM (
								SELECT *FROM(
									SELECT * FROM 
									(
										SELECT PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE GroupNum is null  AND CropType != 'TR'
										UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetGroupDelayDays(@StratYear,@P1Group1DelayMDDate,1,1)), PlanDate)PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE PeriodNo=1 AND GroupNum is not null AND GroupNum = 1 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetGroupDelayDays(@StratYear,@P1Group2DelayMDDate,1,2)), PlanDate)PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE PeriodNo=1 AND GroupNum is not null AND GroupNum = 2 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetGroupDelayDays(@StratYear,@P1Group3DelayMDDate,1,3)), PlanDate)PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE PeriodNo=1 AND  GroupNum is not null AND GroupNum = 3 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetGroupDelayDays(@StratYear,@P1Group4DelayMDDate,1,4)), PlanDate)PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE PeriodNo=1 AND GroupNum is not null AND GroupNum = 4 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetGroupDelayDays(@StratYear,@P1Group5DelayMDDate,1,5)), PlanDate)PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE PeriodNo=1 AND GroupNum is not null AND GroupNum = 5 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetGroupDelayDays(@StratYear,@P1Group6DelayMDDate,1,6)), PlanDate)PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE PeriodNo=1 AND GroupNum is not null AND GroupNum = 6 
											UNION ALL
										SELECT DATEADD(DAY,(Select * FROM GetGroupDelayDays(@StratYear,@P2Group1DelayMDDate,2,1)), PlanDate)PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE PeriodNo=2 AND GroupNum is not null AND GroupNum = 1 
											UNION ALL
										SELECT DATEADD(DAY,(Select * FROM GetGroupDelayDays(@StratYear,@P2Group2DelayMDDate,2,2)), PlanDate)PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE PeriodNo=2 AND GroupNum is not null AND GroupNum = 2 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetGroupDelayDays(@StratYear,@P2Group3DelayMDDate,2,3)), PlanDate)PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE PeriodNo=2 AND GroupNum is not null AND GroupNum = 3 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetGroupDelayDays(@StratYear,@P2Group4DelayMDDate,2,4)), PlanDate)PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE PeriodNo=2 AND GroupNum is not null AND GroupNum = 4 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetGroupDelayDays(@StratYear,@P2Group5DelayMDDate,2,5)), PlanDate)PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE PeriodNo=2 AND GroupNum is not null AND GroupNum = 5 
											UNION ALL
										SELECT DATEADD(DAY, (Select * FROM GetGroupDelayDays(@StratYear,@P2Group6DelayMDDate,2,6)), PlanDate)PlanDate,GroupNum
										,GroupNo_1,GroupNo_2,CropType ,PeriodNo ,CropCount,PlanTotal,ProofTotal,RealTotal
											,CanalAdiust ,CanalAdiustDelt FROM tbl WHERE PeriodNo=2 AND GroupNum is not null AND GroupNum = 6 											
									)AS temp1
								) AS temp2
								WHERE　
								(
									(GroupNo_1 is null OR GroupNo_1 not in ('0')) AND
									(GroupNo_2 is null OR GroupNo_2 not in ('0'))
								)
							)AS temp3
                    ) AS t1
                    GROUP BY PlanDate
                    ORDER BY PlanDate
                ");

            var result = defaultDB.Query<IrrigationPlanModel.IrrigationPlanData>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate,
                    StratYear = StartDate.Split('-')[0],
                    ManageID = ManageID,
                    P1Group1DelayMDDate = _P1Group1DelayMDDate,
                    P1Group2DelayMDDate = _P1Group2DelayMDDate,
                    P1Group3DelayMDDate = _P1Group3DelayMDDate,
                    P1Group4DelayMDDate = _P1Group4DelayMDDate,
                    P1Group5DelayMDDate = _P1Group5DelayMDDate,
                    P1Group6DelayMDDate = _P1Group6DelayMDDate,
                    P2Group1DelayMDDate = _P2Group1DelayMDDate,
                    P2Group2DelayMDDate = _P2Group2DelayMDDate,
                    P2Group3DelayMDDate = _P2Group3DelayMDDate,
                    P2Group4DelayMDDate = _P2Group4DelayMDDate,
                    P2Group5DelayMDDate = _P2Group5DelayMDDate,
                    P2Group6DelayMDDate = _P2Group6DelayMDDate
                });

            return result.ToList();
        }


        #endregion 時間序列資料

        #region 資料加總

        public List<DataSummary.IrrigData> GetIrrigPlanDataTenDaySummaryByRange
            (string StartDate, string EndDate, string[] TR1Area, string[] TR2Area, string[] TSTMArry)
        {
            string cond1 = string.Empty;
            string cond2 = string.Empty;
            string cond3 = string.Empty;
            string cond4 = string.Empty; //FOR GROUP CONDITION

            if (TR1Area.Length == 0)
            {
                cond1 = "(CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-1' OR AreaID_1 not in ('0')) AND " +
                        "(CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-1' OR AreaID_2 not in ('0'))";
            }
            else
            {
                if (TR1Area[0] != "0")
                {
                    List<string> list = new List<string>();
                    list = TR1Area.ToList();
                    list.Add("9");
                    TR1Area = list.ToArray();
                }
                cond1 = "(CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-1' OR AreaID_1 not in  @TR1Area) AND " +
                        "(CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-1' OR AreaID_2 not in  @TR1Area)";
            }
            if (TR2Area.Length == 0)
            {
                cond2 = "(CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-2' OR AreaID_1 not in ('0')) AND " +
                        "(CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-2' OR AreaID_2 not in ('0'))";
            }
            else
            {
                if (TR2Area[0] != "0")
                {
                    List<string> list = new List<string>();
                    list = TR2Area.ToList();
                    list.Add("9");
                    TR2Area = list.ToArray();
                }
                cond2 = "(CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-2' OR AreaID_1 not in @TR2Area) AND " +
                        "(CropType + '-' + CONVERT(varchar(10), PeriodNo) != 'TR-2' OR AreaID_2 not in @TR2Area)";
            }
            if (TSTMArry.Length == 0)
            {
                cond3 = "(CropCount is null) OR (CropType+'-'+CONVERT(varchar(10), CropCount) not in ('TM-0')) ";
            }
            else
            {
                if (TSTMArry[0] != "TM-0")
                {
                    List<string> CropCountList = new List<string>();
                    for (int i = 0; i < TSTMArry.Length; i++)
                    {
                        CropCountList.Add(TSTMArry[i].Split('-')[1]);
                    }
                    CropCountList = CropCountList.Distinct().ToList();
                    List<string> list = new List<string>();
                    list = TSTMArry.ToList();
                    for (int i = 0; i < CropCountList.Count; i++)
                    {
                        list.Add("TL-" + CropCountList[i]);
                    }
                    TSTMArry = list.ToArray();
                }
                cond3 = "(CropCount is null) OR (CropType+'-'+CONVERT(varchar(10), CropCount) not in @TSTMArry) ";
            }

            string sqlStatement =
                string.Format(
                @"
                SELECT 
	                min(tbl_Irrig.DateTime) AS PlanDate
	                ,CASE 
		                WHEN SUM(tbl_Irrig.PlanTotal) is null THEN  0
		                ELSE SUM(tbl_Irrig.PlanTotal)
	                END AS PlanTotal
	                ,TenDayList.TenDayNo FROM (
                SELECT DateTime, SUM(PlanTotal) PlanTotal 
			FROM GetDateTable(@StartDate, @EndDate) AS tblDate
			LEFT JOIN
			(
				SELECT *
				FROM
				(
						SELECT PlanDate
							,SUBSTRING(CONVERT(varchar(10), AreaID),1,1) AS AreaID_1
							,SUBSTRING(CONVERT(varchar(10), AreaID),2,1) AS AreaID_2
							,SUBSTRING(CONVERT(varchar(10), GroupNo),1,1) AS GroupNo_1
							,SUBSTRING(CONVERT(varchar(10), GroupNo),2,1) AS GroupNo_2
							,CropType ,PeriodNo ,CropCount
							,PlanTotal,ProofTotal,RealTotal
						FROM vwIrrigationPlanManageData 
				) AS temp2
				WHERE (PlanDate between @StartDate AND @EndDate) AND
					({2}) AND
				(
					(GroupNo_1 is null OR GroupNo_1 not in ('0')) OR
					(GroupNo_2 is null OR GroupNo_2 not in ('0'))
				)AND
                (
	                {0}
	                AND
	                {1}
                )
			) AS tbl_data ON tblDate.DateTime = tbl_data.PlanDate
			GROUP BY DateTime
            ) AS tbl_Irrig
            LEFT JOIN dbo.vwTenDaysList AS TenDayList 
            ON SUBSTRING(convert(varchar, tbl_Irrig.DateTime, 110), 1, 5) >=SUBSTRING(convert(varchar, TenDayList.StartDate, 110), 1, 5) AND
	            SUBSTRING(convert(varchar, tbl_Irrig.DateTime, 110), 1, 5) <=SUBSTRING(convert(varchar, TenDayList.EndDate, 110), 1, 5)
            WHERE TenDayList.TenDayNo is not null
            GROUP BY TenDayList.TenDayNo
            ORDER BY min(tbl_Irrig.DateTime)
                ", cond1, cond2, cond3);


            var result = defaultDB.Query<DataSummary.IrrigData>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate,
                    TR1Area = TR1Area,
                    TR2Area = TR2Area,
                    TSTMArry = TSTMArry
                });

            return result.ToList();
        }

        public List<DataSummary.PubicData> GetPublicDataTenDaySummaryByRange
            (string type, string StartDate, string EndDate)
        {
            string sqlStatement =
                string.Format(
                @"
                   SELECT min(tblDate.DateTime)DateTime
		                    ,SupplyType
		                    ,CASE WHEN SUM(PlanTotal*8.64) is null THEN 0 ELSE SUM(PlanTotal*8.64) END PlanTotal
		                    ,CASE WHEN SUM(ProofTotal*8.64) is null THEN 0 ELSE SUM(ProofTotal*8.64) END ProofTotal
		                    ,CASE WHEN SUM(RealTotal*8.64) is null THEN 0 ELSE SUM(RealTotal*8.64) END RealTotal												
		                    ,TenDayList.TenDayNo
                    FROM tbl_PublicUseOfWater AS tbl_Pub
					RIGHT JOIN  (SELECT * FROM GetDateTable(@StartDate , @EndDate)) AS tblDate ON tbl_Pub.SupplyDate = tblDate.DateTime
                    LEFT JOIN dbo.vwTenDaysList AS TenDayList 
		                    ON SUBSTRING(convert(varchar, tblDate.DateTime, 110), 1, 5) >=SUBSTRING(convert(varchar, TenDayList.StartDate, 110), 1, 5) AND
		                    SUBSTRING(convert(varchar, tblDate.DateTime, 110), 1, 5) <=SUBSTRING(convert(varchar, TenDayList.EndDate, 110), 1, 5)
                    WHERE (SupplyType = @type OR　SupplyType　is null) AND TenDayList.TenDayNo is not null
                    GROUP BY TenDayList.TenDayNo,SupplyType
                    ORDER BY min(tblDate.DateTime)
                ");


            var result = defaultDB.Query<DataSummary.PubicData>(
                sqlStatement,
                new
                {
                    type = type,
                    StartDate = StartDate,
                    EndDate = EndDate,
                });

            return result.ToList();
        }

        public List<DataSummary.QInflowData> GetQInflowDataTenDaySummaryByRange
            (string StartDate, string EndDate)
        {

            string sqlStatement =
                string.Format(
                @"
                
                
                                SELECT	min(T1.DateTime)DateTime, SUM(Q10)Q10, SUM(Q20)Q20, SUM(Q30)Q30, SUM(Q40)Q40, SUM(Q50)Q50, SUM(Q60)Q60
								, SUM(Q70)Q70, SUM(Q75)Q75, SUM(Q80)Q80, SUM(Q85)Q85, SUM(Q90)Q90, SUM(Q95)Q95, SUM(QAverage)QAverage
								, SUM(HistoryData.InflowTotal)Inflow
								, TenDayList.TenDayNo
                FROM
                (
	                SELECT	DateTime,t2.Q10 ,t2.Q20 ,t2.Q30 ,t2.Q40 ,t2.Q50 ,t2.Q60 ,t2.Q70 ,t2.Q75 ,t2.Q80 ,t2.Q85 ,t2.Q90 ,t2.Q95, t2.QAverage
	                FROM GetDateTable(@StartDate,@EndDate) AS t1
	                LEFT JOIN tbl_GridBoundaryPiValue AS t2 ON Month(t1.DateTime) = Month(t2.PiTypeValueDate) 
		                AND CASE 
			                WHEN DAY(DateTime)-10<=0 THEN 1+((MONTH(DateTime)-1)*3) 
			                WHEN 1<=(DAY(DateTime)-10) AND (DAY(DateTime)-10)<=10 THEN 2+((MONTH(DateTime)-1)*3)
			                WHEN 11<=DAY(DateTime)-10 THEN 3+((MONTH(DateTime)-1)*3)
		                END = t2.PiTypeValue
	                WHERE	t2.PiField ='InflowTotalAverageValue' AND t2.PiType = 'TenDays'  AND YEAR(t2.StartDate) ='2002'
                ) AS T1
                LEFT JOIN(
	                SELECT Time, InflowTotal FROM vwReservoirDataApplication
	                WHERE StationNo = '10201' AND (Time between @StartDate AND @EndDate)
                )AS HistoryData ON SUBSTRING(convert(varchar, HistoryData.Time, 110), 1, 5) =  SUBSTRING(convert(varchar, T1.DateTime, 110), 1, 5)
                LEFT JOIN dbo.vwTenDaysList AS TenDayList 
                ON SUBSTRING(convert(varchar, T1.DateTime, 110), 1, 5) >=SUBSTRING(convert(varchar, TenDayList.StartDate, 110), 1, 5) AND
	                SUBSTRING(convert(varchar, T1.DateTime, 110), 1, 5) <=SUBSTRING(convert(varchar, TenDayList.EndDate, 110), 1, 5)
                WHERE TenDayList.TenDayNo is not null
                GROUP BY TenDayList.TenDayNo
                ORDER BY min(T1.DateTime)
                
                
                ");


            var result = defaultDB.Query<DataSummary.QInflowData>(
                sqlStatement,
                new
                {
                    StartDate = StartDate,
                    EndDate = EndDate,
                });

            return result.ToList();
        }
        #endregion 資料加總

        #endregion 前台查資料用

        #region WRWSR

        #region WRWSR 儀錶板

        #region 耕作情勢
        public List<CropIrrigationData> GetDashBoardvsIrrigData()
        {

            try
            {
                string sqlStatement =
                string.Format(
                        @"
                         WITH tbl_data AS(
	                        SELECT FLOOR(SUM(t1.CalcArea)/10000) AS CropArea, 
			                        t2.IANo AS IrrigationID, t2.IAName AS IrrigationName, 
			                        t1.DataYear AS  IrrigationYear
									,MAX(t1.DataDate)DataDate
	                        FROM tbl_CropAreaData_History t1
	                        JOIN tbl_IAStation  t2 ON t1.WorkStationId=t2.WorkStationId
	                        WHERE 
	                            t1.CropType='TR' AND t1.DataYear = (SELECT MAX(DataYear) FROM tbl_CropAreaData_History)
	                            AND t1.PeriodNo in (1,2)
	                        GROUP BY  t2.IANo, t2.IAName, t1.DataYear
                        ), tbl_AVG AS (
	                        SELECT IrrigationID, IrrigationName, 
		                        SUM(CropArea)CropArea, COUNT(YearCount)YearCount,
		                        FLOOR(SUM(CropArea)/COUNT(YearCount))AvgCropArea
	                        FROM (
		                        SELECT FLOOR(SUM(t1.CalcArea)/10000) AS CropArea, 
				                        t2.IANo AS IrrigationID, t2.IAName AS IrrigationName, 
				                        t1.DataYear AS  YearCount
		                        FROM tbl_CropAreaData_History t1
		                        JOIN tbl_IAStation  t2 ON t1.WorkStationId=t2.WorkStationId
		                        WHERE 
		                            t1.CropType='TR' AND t1.PeriodNo in (1,2) 
                                    AND t1.DataYear != (SELECT MAX(DataYear) FROM tbl_CropAreaData_History)
		                        GROUP BY  t2.IANo, t2.IAName, t1.DataYear
	                        ) AS T1
	                        GROUP BY IrrigationID, IrrigationName
                        )

                        SELECT t1.IrrigationID, t1.IrrigationName, t2.CropArea, t1.AvgCropArea,t2.DataDate,
		                        CAST(ROUND((t2.CropArea - t1.AvgCropArea)/t1.AvgCropArea*100,0) AS decimal(4,0)) AS Percentage FROM tbl_AVG AS t1
                        LEFT JOIN tbl_data  AS t2 ON t1.IrrigationID = t2.IrrigationID
                        WHERE t1.IrrigationID in (
                                SELECT *
                                FROM STRING_SPLIT(
	                                (
		                                SELECT value from tbl_AppParam  WHERE Category = 'DashBoard' AND Type = 'WidgetParam' AND Name = '_IrrigationSituation'
	                                ),',') AS t1
                        )
                        ORDER BY t1.IrrigationID ASC
                        "
                        );

                var result = defaultDB.Query<CropIrrigationData>(sqlStatement);

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion

        #endregion

        #region 4.1.1 蓄水量供灌模擬

        public List<IrrigationPlanData> GetIrrigationPlanDateSeriesData(string StationNo , string startDate, string endDate, string[] ManageID)
        {
            string sqlStatement =
                @"
                SELECT  FORMAT(PlanDate, 'yyyy-MM-dd') [PlanDate] 
                        ,SUM([PlanTotal]) PlanTotal,SUM([ProofTotal]) ProofTotal,SUM([RealTotal])RealTotal
                        FROM  vwIrrigationPlanManageData
                WHERE 
                    IANo in(
                        SELECT * FROM STRING_SPLIT((
                        SELECT value from tbl_AppParam 
                        WHERE Category = 'Reservoir' AND Type = 'STNoToIANo' AND NAME = @StationNo),',') AS t1
                    )
                    AND PlanDate Between @startDate AND @endDate
                    AND ManageID Not in @ManageID
                    Group By FORMAT(PlanDate, 'yyyy-MM-dd') 
                    ORDER BY FORMAT(PlanDate, 'yyyy-MM-dd') ASC
                ";

            var sqlParams = new
            {
                StationNo = StationNo,
                startDate = startDate,
                endDate = endDate,
                ManageID = ManageID
            };

            var result = defaultDB.Query<IrrigationPlanData>(sqlStatement, sqlParams);
            return result.ToList();
        }

        public List<IrrigationPlanData> GetAreaIrrigaDateSeriesData(string StationNo, string startDate, string endDate, string[] ManageID, int AreaType = 1)
        {
            string startY = startDate.Split('-')[0];
            string endY = endDate.Split('-')[0];
            string sqlStatement =
                @"
                WITH tbl_data AS(
                SELECT 
	                CAST(t1.DataYear AS　nvarchar)　+'-'+ FORMAT(t2.PlanDate,'MM-dd') PlanDate, 
	                t2.IANo,t2.GroupNum,t1.FieldArea AS IrrgFieldArea, t2.FieldArea AS TotalFieldArea,
	                t2.ManageID, t2.ManageName,t2.GroupNo,t2.CropType,t2.CropCount,t2.PeriodNo,
	                Cast(t1.FieldArea/t2.FieldArea*t2.PlanTotal AS decimal(10,2)) AS PlanTotal,
	                Cast(t1.FieldArea/t2.FieldArea*t2.ProofTotal AS decimal(10,2)) AS ProofTotal,
	                Cast(t1.FieldArea/t2.FieldArea*t2.RealTotal AS decimal(10,2)) AS RealTotal,
	                Cast(t1.FieldArea/t2.FieldArea*t2.CanalAdiust AS decimal(10,2)) AS CanalAdiust,
	                Cast(t1.FieldArea/t2.FieldArea*t2.CanalAdiustDelt AS decimal(10,2)) AS CanalAdiustDelt,
					(SELECT * FROM GetIrrigPeriodStartDate(@StationNo,@endY,'1'))Period1StartDate,
					(SELECT * FROM GetIrrigPeriodStartDate(@StationNo,@startY,'2'))Period2StartDate
	                FROM [tbl_IrrigationRiceAreaManageData] AS t1
	                LEFT JOIN [vwIrrigationPlanManageData] AS t2 ON t1.IANo = t2.IANo　AND t1.ManageID = t2.ManageID　AND t1.PeriodNo = t2.PeriodNo
	                WHERE DataYear in (@startY,@endY) AND t1.AreaType = @AreaType AND  IsStopped = 0
                )

                SELECT  FORMAT(CAST(PlanDate AS DATE), 'yyyy-MM-dd') [PlanDate] ,PeriodNo ,Period1StartDate,Period2StartDate
                        ,SUM([PlanTotal]) PlanTotal,SUM([ProofTotal]) ProofTotal,SUM([RealTotal])RealTotal
                        FROM  tbl_data
                WHERE 
                    IANo in(
                        SELECT * FROM STRING_SPLIT((
                        SELECT value from tbl_AppParam 
                        WHERE Category = 'Reservoir' AND Type = 'STNoToIANo' AND NAME = @StationNo),',') AS t1
                    )
                    AND PlanDate Between @startDate AND @endDate
                    AND ManageID Not in @ManageID
                    Group By FORMAT(CAST(PlanDate AS DATE), 'yyyy-MM-dd') ,PeriodNo,Period1StartDate,Period2StartDate
                    ORDER BY FORMAT(CAST(PlanDate AS DATE), 'yyyy-MM-dd') ASC
                ";

            var sqlParams = new
            {
                StationNo = StationNo,
                startDate = startDate,
                endDate = endDate,
                startY = startY,
                endY = endY,
                AreaType = AreaType,
                ManageID = ManageID
            };

            var result = defaultDB.Query<IrrigationPlanData>(sqlStatement, sqlParams);
            return result.ToList();
        }


        public List<IrrigationPlanData> GetAvgAreaIrrigaDateSeriesData(string StationNo, string[] ManageID)
        {

            string sqlStatement =
                @"
                WITH tbl_raw AS(
                SELECT [IANo] ,[ManageID] ,[PeriodNo] ,[AreaType]
	                ,Cast(SUM([FieldArea])/COUNT(DataYear) AS decimal(10,2))FieldArea
	                ,[IsStopped]
                FROM [tbl_IrrigationRiceAreaManageData]
                WHERE AreaType = 2 AND IsStopped = 0
                GROUP BY IANo, ManageID, PeriodNo,[AreaType],IsStopped
                ),
                tbl_data AS(
	                SELECT 
		                '9999'　+'-'+ FORMAT(t2.PlanDate,'MM-dd') PlanDate, 
		                t2.IANo,t2.GroupNum,t1.FieldArea AS IrrgFieldArea, t2.FieldArea AS TotalFieldArea,
		                t2.ManageID, t2.ManageName,t2.GroupNo,t2.CropType,t2.CropCount,t2.PeriodNo,
		                Cast(t1.FieldArea/t2.FieldArea*t2.PlanTotal AS decimal(10,2)) AS PlanTotal,
		                Cast(t1.FieldArea/t2.FieldArea*t2.ProofTotal AS decimal(10,2)) AS ProofTotal,
		                Cast(t1.FieldArea/t2.FieldArea*t2.RealTotal AS decimal(10,2)) AS RealTotal,
		                Cast(t1.FieldArea/t2.FieldArea*t2.CanalAdiust AS decimal(10,2)) AS CanalAdiust,
		                Cast(t1.FieldArea/t2.FieldArea*t2.CanalAdiustDelt AS decimal(10,2)) AS CanalAdiustDelt
	                FROM tbl_raw AS t1
	                LEFT JOIN [vwIrrigationPlanManageData] AS t2 ON t1.IANo = t2.IANo　AND t1.ManageID = t2.ManageID　AND t1.PeriodNo = t2.PeriodNo	
                )

                SELECT  FORMAT(CAST(PlanDate AS DATE), 'yyyy-MM-dd') [PlanDate] 
                        ,SUM([PlanTotal]) PlanTotal,SUM([ProofTotal]) ProofTotal,SUM([RealTotal])RealTotal
                FROM  tbl_data
                WHERE 
                    IANo in(
                        SELECT * FROM STRING_SPLIT((
                        SELECT value from tbl_AppParam 
                        WHERE Category = 'Reservoir' AND Type = 'STNoToIANo' AND NAME = @StationNo),',') AS t1
                    )
	                AND ManageID Not in @ManageID
                Group By FORMAT(CAST(PlanDate AS DATE), 'yyyy-MM-dd') 
                ORDER BY FORMAT(CAST(PlanDate AS DATE), 'yyyy-MM-dd') ASC


                ";

            var sqlParams = new
            {
                StationNo = StationNo,
                ManageID = ManageID
            };

            var result = defaultDB.Query<IrrigationPlanData>(sqlStatement, sqlParams);
            return result.ToList();
        }


        public List<PublicUseOfWater.PublicUseOfWaterData> GetPublicUseOfWaterDateSeriesData(
            string StationNo, string StartDate, string EndDate, string SupplyType)
        {
            string strWhereCondition = string.Empty;
            string sqlStatement =
                string.Format(@"
                    SELECT      StationNo, SupplyDate, SupplyType,
                                Cast(PlanTotal  as decimal(14,4)) as PlanTotal,
                                Cast(ProofTotal  as decimal(14,4)) as ProofTotal,
                                Cast(RealTotal  as decimal(14,4)) as RealTotal,
                                Cast(CanalAdiust  as decimal(14,4)) as CanalAdiust,
                                Cast(CanalAdiustDelt as decimal(14,4)) as CanalAdiustDelt
                    FROM        tbl_PublicUseOfWater
                    WHERE       CAST([SupplyDate] AS DATE) Between @StartDate And @EndDate
                            And SupplyType = @SupplyType
                            And StationNo = @StationNo
                    Order By SupplyDate ASC
                ", strWhereCondition);

            var result = defaultDB.Query<PublicUseOfWater.PublicUseOfWaterData>(
                sqlStatement,
                new
                {
                    StationNo = StationNo,
                    StartDate = StartDate,
                    EndDate = EndDate,
                    SupplyType = SupplyType
                });

            return result.ToList();
        }


        #endregion 4.1.1 蓄水量供灌模擬

        #endregion WRWSR

    }
}
