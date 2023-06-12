using Dapper;
using DBClassLibrary.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class DBHelper : BaseRepository
	{
        /// <summary>
        /// 轉換 IEnumerable 至 DataTable
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <returns></returns>
        public DataTable IEnumerableToDataTable<T>(IEnumerable<T> data)
        {
            PropertyDescriptorCollection props = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            DataColumn column = null;
            for (int i = 0; i < props.Count; i++)
            {
                PropertyDescriptor prop = props[i];
                if (prop.PropertyType.Name.StartsWith("Nullable"))
                {
                    column = new DataColumn(prop.Name, prop.PropertyType.GenericTypeArguments[0]);
                    column.AllowDBNull = true;
                }
                else
                {
                    column = new DataColumn(prop.Name, prop.PropertyType);
                }

                table.Columns.Add(column);
            }
            object[] values = new object[props.Count];
            foreach (T item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = props[i].GetValue(item);
                }
                table.Rows.Add(values);
            }
            return table;
        }

        #region 共用
        /// <summary>
        /// 將遠端的資料抄寫到本地的資料表
        /// </summary>
        public int InsertTable(string LocalTable, DataTable RemoteTable)
		{
			try
			{
				defaultDB.Open();
				if (RemoteTable.Rows.Count >= 0)
				{
					string cmd = "Truncate Table " + LocalTable;
					using (SqlCommand com = new SqlCommand(cmd, defaultDB))
					{
						com.ExecuteNonQuery();
					}
					using (SqlBulkCopy BulkCopy = new SqlBulkCopy(defaultDB))
					{
                        BulkCopy.DestinationTableName = LocalTable;
                        BulkCopy.WriteToServer(RemoteTable);
					}
				}
				// 回傳更新筆數
				return RemoteTable.Rows.Count;
			}
			catch (Exception e)
			{
				throw e.GetBaseException();
			}
			finally
			{
				defaultDB.Close();
			}
		}

        /// <summary>
        /// 將遠端的資料抄寫到本地的資料表(不清除本地)
        /// </summary>
        /// <param name="LocalTable"></param>
        /// <param name="RemoteTable"></param>
        /// <param name="Options"></param>
        /// <returns></returns>
		public int NoneClearInsertTable(string LocalTable, DataTable RemoteTable, SqlBulkCopyOptions Options = SqlBulkCopyOptions.Default)
        {
			try
			{
                if (RemoteTable.Rows.Count > 0)
                {
                    using (SqlBulkCopy BulkCopy = new SqlBulkCopy(this.ConnectionString, Options))
                    {
                        BulkCopy.DestinationTableName = LocalTable;
                        BulkCopy.WriteToServer(RemoteTable);
                    }
                }
                // 回傳更新筆數
                return RemoteTable.Rows.Count;
            }
			catch (Exception e)
			{
				throw e.GetBaseException();
			}
		}
		
		/// <summary>
		/// 依條件清除資料
		/// </summary>
		/// <param name="LocalTable"></param>
		/// <param name="Conditions"></param>
		/// <returns></returns>
		public int DelExpireData(string LocalTable, string Conditions)
		{
			string sql = @"DELETE FROM " + LocalTable + " " + Conditions;

			int executeResult = 0;
			try
			{
				//依是否有使用 Transaction 進行不同的呼叫
				if (UsingTransaction == null)
					executeResult = defaultDB.Execute(sql);
				else
					executeResult = defaultDB.Execute(sql, UsingTransaction);
			}
			catch (Exception e)
			{
				throw e.GetBaseException();
			}
			return executeResult;
		}

        /// <summary>
        /// 將DataTable 的資料抄寫到 DB 的資料表(不清除本地)
        /// </summary>
        /// <param name="LocalTable">DB table Name</param>
        /// <param name="RemoteTable">Source data</param>
        /// <param name="Options"></param>
        /// <returns></returns>
        public int InsertDataBySqlBulkCopy(string DBTableName, DataTable SourceTable,
            SqlBulkCopyOptions Options = SqlBulkCopyOptions.Default)
        {
            try
            {
                if (SourceTable.Rows.Count > 0)
                {
                    using (SqlBulkCopy BulkCopy = new SqlBulkCopy(this.ConnectionString, Options))
                    {
                        BulkCopy.DestinationTableName = DBTableName;
                        foreach (DataColumn col in SourceTable.Columns)
                        {
                            BulkCopy.ColumnMappings.Add(col.ColumnName, col.ColumnName);
                        }
                        BulkCopy.WriteToServer(SourceTable);
                    }
                }
                // 回傳更新筆數
                return SourceTable.Rows.Count;
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
        }

        /// <summary>
        /// 最新一筆資料時間
        /// </summary>
        /// <param name="TableName">資料表名</param>
        /// <param name="FieldName">資料時間欄位名稱</param>
        /// <param name="WhereCondition">條件</param>
        /// <param name="OrderbyFieldName">條件</param>
        /// <param name="DefaultDateTime">若DB裡沒有值, 則回傳此日期</param>
        /// <returns></returns>
        public DateTime GetMAXTime(string TableName, string FieldName, string WhereCondition, 
            string OrderbyFieldName, DateTime DefaultDateTime = default(DateTime))
        {
            //若DB裡沒有值, 且沒有指定要回傳的日期
            if (DefaultDateTime == default(DateTime))
                DefaultDateTime = DateTime.Now.AddHours(-1);

            try
            {
                string sqlStatement =
                    string.Format(
                        @"SELECT Top 1 {1} AS MAXTime FROM {0}
                            {2}
                            Order By {3} desc", TableName, FieldName, WhereCondition, OrderbyFieldName);
                var result = defaultDB.Query<DateTime>(sqlStatement).FirstOrDefault();

                return result == DateTime.MinValue ? DefaultDateTime : result;
            }
            catch (Exception e)
            {
                throw e;
            }

        }

        #endregion 共用

    }
}
