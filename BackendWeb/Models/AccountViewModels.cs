using DBClassLibrary.DomainLayer.UnitModel;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BackendWeb.Models
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(Name = "電子郵件")]
        public string Email { get; set; }
    }

    public class ExternalLoginListViewModel
    {
        public string ReturnUrl { get; set; }
    }

    public class SendCodeViewModel
    {
        public string SelectedProvider { get; set; }
        public ICollection<System.Web.Mvc.SelectListItem> Providers { get; set; }
        public string ReturnUrl { get; set; }
        public bool RememberMe { get; set; }
    }

    public class VerifyCodeViewModel
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        [Display(Name = "代碼")]
        public string Code { get; set; }
        public string ReturnUrl { get; set; }

        [Display(Name = "記住此瀏覽器?")]
        public bool RememberBrowser { get; set; }

        public bool RememberMe { get; set; }
    }

    public class ForgotViewModel
    {
        [Required]
        [Display(Name = "電子郵件")]
        public string Email { get; set; }
    }

    public class LoginViewModel
    {
        //[Required]
        //[Display(Name = "電子郵件")]
        //[EmailAddress]
        //public string Email { get; set; }

        [Required(ErrorMessage = "請輸入帳號")]
        [Display(Name = "帳號")]
        [StringLength(20, ErrorMessage = "{0} 的長度至少必須為 {2} 個字元。", MinimumLength = 3)]
        public string UserName { get; set; }

        [Required(ErrorMessage = "請輸入密碼")]
        [DataType(DataType.Password)]
        [Display(Name = "密碼")]
        public string Password { get; set; }

        [Display(Name = "記住我?")]
        public bool RememberMe { get; set; }
    }

    public class RegisterViewModel
    {
        [Required(ErrorMessage = "請輸入電子信箱。")]
        [EmailAddress]
        [Display(Name = "* 電子信箱")]
        public string Email { get; set; }

        [Required(ErrorMessage = "請輸入密碼。")]
        [StringLength(100, ErrorMessage = "{0} 的長度至少必須為 {2} 個字元。", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "* 密碼")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "* 確認密碼")]
        [Compare("Password", ErrorMessage = "密碼和確認密碼不相符。")]
        public string ConfirmPassword { get; set; }

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

        [Required(ErrorMessage = "請選擇所屬機關。")]
        [Display(Name = "* 所屬機關")]
        public int UnitID { get; set; }

        [Display(Name = "服務單位")]
        [StringLength(100)]
        public string SubUnit { get; set; }

        [Display(Name = "所屬群組")]
        public string RoleName { get; set; }

        #region 預留使用者可以屬於多單位, 多個群組的狀況  
        [Display(Name = "服務單位")]
        public List<UserUnitData> UnitsList { get; set; }

        [Display(Name = "所屬群組")]
        public List<string> RolesList { get; set; }
        #endregion

    }

    public class ResetPasswordViewModel
    {
        [Required(ErrorMessage = "請輸入帳號")]
        [Display(Name = "帳號")]
        [StringLength(20, ErrorMessage = "{0} 的長度至少必須為 {2} 個字元。", MinimumLength = 3)]
        public string UserName { get; set; }

        [EmailAddress]
        [Display(Name = "電子郵件")]
        public string Email { get; set; }

        [Required(ErrorMessage = "請輸入密碼")]
        [StringLength(100, ErrorMessage = "{0} 的長度至少必須為 {2} 個字元。", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "密碼")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "確認密碼")]
        [Compare("Password", ErrorMessage = "密碼和確認密碼不相符。")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }

    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "電子郵件")]
        public string Email { get; set; }
    }
}
