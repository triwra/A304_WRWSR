using System;

namespace DBClassLibrary.UserDomainLayer.SensLinkModel
{
    class SensLinkModel
    {
    }

    #region API

    /// <summary>
    /// Token
    /// </summary>
    public class TokenObject
    {
        public string access_token { get; set; }
        public string token_type { get; set; }
        public int expires_in { get; set; }
        public string refresh_token { get; set; }
    }

    #endregion API

    #region 取得最新物理量數值

    /// <summary>
    /// 最新物理量數值
    /// </summary>
    public class PhysicalQuantity_LatestData
    {
        public string Id { get; set; }
        public DateTime TimeStamp { get; set; }
        public decimal? Value { get; set; }
        public int? ValueStatus { get; set; }
    }

    #endregion 取得最新物理量數值

    /// <summary>
    /// 取得最新物理量數值 的名單
    /// </summary>
    public class PhysicalQuantityGetList
    {
        public string PhysicalQuantityID { get; set; }
        public string StationID { get; set; }
    }

}
