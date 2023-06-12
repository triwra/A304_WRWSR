using System;

namespace DBClassLibrary.UserDataAccessLayer
{
    class CommonHelper
    {

    }

    /// <summary>
    /// 將換行字元轉為<BR/>, 供網頁顯示用
    /// </summary>
    public static class stringExtension
    {
        public static string FormateNewLineToBR(this string value)
        {
            if (value != null)
                return value.Replace("\r\n", "<br />");
            else
                return string.Empty;
        }

        public static string FormateNewLineToP(this string value)
        {
            if (value != null)
                return value.Replace("\r\n", "<p class=\"LiteratureDetail\"></p>");
            else
                return string.Empty;
        }

        public static string FormateBranchToBR(this string value)
        {
            if (value != null)
                return value.Replace(";", "<br />");
            else
                return string.Empty;
        }

        public static string FormateBranchToSlash(this string value)
        {
            if (value != null)
                return value.Replace(";", " / ");
            else
                return string.Empty;
        }

        /// <summary>
        /// 供EXCEL 換行用
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string FormateBranchToChr10(this string value)
        {
            char c = (char)10;
            char s = Convert.ToChar(";");
            if (value != null)
                return value.Replace(s, c);
            else
                return string.Empty;
        }

        /// <summary>
        /// 此方法會使用 LastIndexOf(Char) 方法來尋找字串中的最後一個目錄分隔符號，而不包含其路徑。
        /// </summary>
        /// <param name="filepath"></param>
        /// <returns></returns>
        public static string ExtractFilename(this string value)
        {
            // If path ends with a "\", it's a path only so return String.Empty.
            if (value.Trim().EndsWith(@"\"))
                return String.Empty;
            // Determine where last backslash is.
            int position = value.LastIndexOf('\\');
            // If there is no backslash, assume that this is a filename.
            if (position == -1)
                return String.Empty;
            else
                return value.Substring(position + 1);

        }

    }

}
