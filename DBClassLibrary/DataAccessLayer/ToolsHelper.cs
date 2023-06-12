using DBClassLibrary.UserDomainLayer.CommonDataModel;
using System;
using System.Collections.Generic;

namespace DB_ClassLibrary.UserDataAccessLayer
{
    public class ToolsHelper
    {
        /// <summary>
        /// 產生指定年度的旬日期範圍的List
        /// </summary>
        /// <param name="Year"></param>
        public List<TenDaysPeriodData> GetTenDaysPeriodList(int Year)
        {
            /* 紀旬法是古代遺留下來的。人們把每個月的前10天稱為上旬，當中的10天稱為中旬，
             * 後10天稱為下旬。但有的月份下旬不足10天仍作為一旬。
             */

            List<TenDaysPeriodData> ListInfo = new List<TenDaysPeriodData>();
            //逐月計算 1 ~ 12 月
            DateTime CurrentMonth = Convert.ToDateTime(Year + "/01/01");
            int TenDaysOfYear = 1;
            TenDaysPeriodData itemData = new TenDaysPeriodData();
            for (int i = 1; i <= 12; i++)
            {
                //上旬
                itemData.TenDaysOfYear = TenDaysOfYear;
                itemData.TenDaysType = 1;
                itemData.StartDate = CurrentMonth;
                itemData.EndDate = itemData.StartDate.AddDays(10).AddSeconds(-1);
                TenDaysOfYear++;
                ListInfo.Add(itemData.Clone());
                //中旬
                itemData.TenDaysOfYear = TenDaysOfYear;
                itemData.TenDaysType = 2;
                itemData.StartDate = CurrentMonth.AddDays(10);
                itemData.EndDate = itemData.StartDate.AddDays(10).AddSeconds(-1);
                TenDaysOfYear++;
                ListInfo.Add(itemData.Clone());
                //下旬
                itemData.TenDaysOfYear = TenDaysOfYear;
                itemData.TenDaysType = 3;
                itemData.StartDate = CurrentMonth.AddDays(20);
                itemData.EndDate = CurrentMonth.AddMonths(1).AddSeconds(-1);
                TenDaysOfYear++;
                ListInfo.Add(itemData.Clone());
                //處理下個月
                CurrentMonth = CurrentMonth.AddMonths(1);                
            }

            return ListInfo;
        }

    }

}
