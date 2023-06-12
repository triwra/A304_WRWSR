using System.ComponentModel.DataAnnotations;

namespace DBClassLibrary.DomainLayer.UnitModel
{
    /// <summary>
    /// 單位/部門資料
    /// </summary>
    public class UnitData
    {
        [Display(Name = "所屬單位")]
        public int UnitID { get; set; }

        [Required(ErrorMessage = "請輸入單位編號。")]
        [Display(Name = "單位編號")]
        [StringLength(20, ErrorMessage = "{0} 的長度至少必須為 {2} 個字元。", MinimumLength = 2)]
        public string UnitNumber { get; set; }

        [Required(ErrorMessage = "請輸入單位名稱。")]
        [Display(Name = "單位名稱")]
        public string UnitName { get; set; }

        [Display(Name = "單位類型")]
        public short? Unit_Type { get; set; }
    }

    /// <summary>
    /// 單位/部門資料
    /// </summary>
    public class UserUnitData
    {
        [Required]
        [Display(Name = "所屬單位")]
        public int UnitID { get; set; }
        public string UnitNumber { get; set; }
        public string UnitName { get; set; }
        public string UserID { get; set; }
    }
}
