using System;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;

namespace DBClassLibrary.Data
{
    public class BaseRepository : IDisposable
    {
        public string ConnectionString { get; set; }
        private SqlConnection _defaultDB;
        private SqlConnection _SecondDB;
        private SqlConnection SourceDB;
        private DbConnection BaseConnection;
        private DbTransaction BaseTransaction;
        private bool isCommit = false;
        private bool isRollback = false;

        #region 資料存取物件建構式
        public BaseRepository()
        {
            //預設要使用的連線字串名稱
            this.ConnectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            _defaultDB = new SqlConnection(this.ConnectionString);
            SourceDB = _defaultDB;
        }

        public BaseRepository(string connectionString)
        {
            //指定要使用的連線字串名稱
            this.ConnectionString = connectionString;
            _defaultDB = new SqlConnection(connectionString);
            SourceDB = _defaultDB;
        }

        public BaseRepository(string connectionString1, string connectionString2)
        {
            //指定要使用的連線字串名稱
            this.ConnectionString = connectionString1;
            _defaultDB = new SqlConnection(connectionString1);
            _SecondDB = new SqlConnection(connectionString2);
            SourceDB = _defaultDB;
        }
        #endregion 資料存取物件建構式

        #region 定義可用的資料連接
        protected SqlConnection defaultDB
        {
            //由建構式決定
            get
            {
                SourceDB = _defaultDB;
                return SourceDB;
            }
        }

        /// <summary>
        /// 第二個以上的資料連接
        /// </summary>
        protected SqlConnection SecondDB
        {
            get
            {
                SourceDB = _SecondDB;
                return SourceDB;
            }
        }
        #endregion 定義可用的資料連接

        #region 交易處理 相關
        /// <summary>
        /// 回傳目前使用中的交易
        /// </summary>
        public DbTransaction UsingTransaction
        {
            get { return BaseTransaction; }
        }

        /// <summary>
        /// 建立 Transaction (獨立的(IsolationLevel指定), 或是 合併交易)
        /// </summary>
        public void BeginTransaction()
        {
            BaseConnection = SourceDB;
            BaseConnection.Open();
            BaseTransaction = BaseConnection.BeginTransaction();
        }

        public void BeginTransaction(IsolationLevel Level)
        {
            BaseConnection = SourceDB;
            BaseConnection.Open();
            BaseTransaction = BaseConnection.BeginTransaction(Level);
        }

        public void BeginTransaction(DbTransaction ExternalTrans)
        {
            BaseConnection = ExternalTrans.Connection;
            BaseTransaction = ExternalTrans;
        }

        /// <summary>
        /// Commit Transaction
        /// </summary>
        public void Commit()
        {
            BaseTransaction.Commit();
            isCommit = true;
        }

        /// <summary>
        /// Rollback Transaction
        /// </summary>
        public void Rollback()
        {
            BaseTransaction.Rollback();
            isRollback = true;
        }

        /// <summary>
        /// 毀構函式 (清除或結束 Connection)
        /// </summary>
        void IDisposable.Dispose()
        {
            //預設為 自動 Rollback
            if (BaseTransaction != null && !isCommit && !isRollback)
                BaseTransaction.Rollback();

            if (BaseConnection != null)
                BaseConnection.Close();

            if (_defaultDB != null)
                _defaultDB.Close();

            if (_SecondDB != null)
                _SecondDB.Close();
        }

        #endregion 交易處理 相關


    }
}
