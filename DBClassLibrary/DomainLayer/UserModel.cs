using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DBClassLibrary.DomainLayer.UserModel
{
    public class UserData
    {
        public string Id { get; set; }
        public bool EmailConfirmed { get; set; }
        public string SecurityStamp { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }

        [Display(Name = "鎖定到期時間")]
        public DateTime? LockoutEndDateUtc { get; set; }
        [Display(Name = "允許啟用鎖定")]
        public bool LockoutEnabled { get; set; }
        [Display(Name = "登入失敗次數")]
        public int AccessFailedCount { get; set; }

        [Required(ErrorMessage = "請輸入電子信箱。")]
        [EmailAddress]
        [Display(Name = "* 電子信箱")]
        public string Email { get; set; }

        [Display(Name = "聯絡電話")]
        [StringLength(100)]
        public string PhoneNumber { get; set; }

        //以下為自訂欄位
        [Required(ErrorMessage = "請輸入帳號。")]
        [Display(Name = "* 帳號")]
        [StringLength(20, ErrorMessage = "{0} 的長度至少必須為 {2} 個字元。", MinimumLength = 3)]
        public string UserName { get; set; }

        [Required(ErrorMessage = "請輸入姓名。")]
        [Display(Name = "* 姓名")]
        [StringLength(10, ErrorMessage = "{0} 的長度至少必須為 {2} 個字元。", MinimumLength = 2)]
        public string RealName { get; set; }

        [Display(Name = "職位名稱")]
        [StringLength(100)]
        public string Title { get; set; }

        [Required(ErrorMessage = "請選擇服務單位。")]
        [Display(Name = "* 服務單位")]
        public int UnitID { get; set; }

        [Display(Name = "AD服務單位")]
        [StringLength(100)]
        public string SubUnit { get; set; }

        [Display(Name = "所屬群組")]
        public string RoleName { get; set; }

        #region 預留使用者可以屬於多單位, 多個群組的狀況  
        [Display(Name = "服務單位")]
        public List<UnitModel.UserUnitData> UnitsList { get; set; }

        [Display(Name = "所屬群組")]
        public List<string> RolesList { get; set; }
        #endregion

    }


}
