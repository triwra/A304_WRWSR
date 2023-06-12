using System.ComponentModel.DataAnnotations;

namespace DBClassLibrary.DomainLayer.RoleModel
{
    public class UserRoleData
    {
        public string Id { get; set; }

        [Required(ErrorMessage = "請輸入群組名稱。")]
        [Display(Name = "群組名稱")]
        public string Name { get; set; }
    }
}
