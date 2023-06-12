using System.Collections.Generic;

namespace DBClassLibrary.UserDomainLayer.MenuModel
{
    public enum AppMenuType
    {
        Function = 1,
        Category = 2,
        Header = 3,
        Divider = 4
    }

    public enum SubMenuDispType
    {
        TextDivider = 1,
        Droperd = 2,
        Collapse = 3
    }

    public class AppMenu
    {
        public int Id { get; set; }
        public AppMenuType Type { get; set; }
        public string Label { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
        public string Glyphicon { get; set; }
        public int Layer { get; set; }
        public int Parent { get; set; }
        public int Ordinal { get; set; }
        public bool Authorize { get; set; }
        public bool Enabled { get; set; }
        public bool Visible { get; set; }
        public int SubMenuDispType { get; set; }
        public int Serial { get; set; }
        public AppMenu ParentMenu;
        public List<AppMenu> SubMenu { get; set; }
        public bool Checked { get; set; }

        public AppMenu Clone()
        {
            return this.MemberwiseClone() as AppMenu;
        }
    }

    public class RoleMenu
    {
        public string RoleId { get; set; }
        public int MenuId { get; set; }
    }

    public class UserMenu
    {
        public string UserId { get; set; }
        public int MenuId { get; set; }
        public int Ordinal { get; set; }
    }
}
