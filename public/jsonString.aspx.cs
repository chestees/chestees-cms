using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Configuration;
using System.Text;
using System.IO;

public partial class json : Page
{
  public myFunctions myFunctionsInstance = new myFunctions();
  public constants varConst = new constants();

  public static String Test(string s)
  {
      if (String.IsNullOrEmpty(s))
          return null;
      else
          return s;
  }

  protected void Page_Load(object sender, EventArgs e)
  {
      StringBuilder strJSON = new StringBuilder();

      using (varConst.conn)
        {
            varConst.conn.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = varConst.conn;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "usp_JSON";
            SqlDataReader rdr = cmd.ExecuteReader();
            if (rdr.HasRows)
            {
                int     diggID;
                string  image;
                string  link;
                string  title;
                int     diggStoreId;
                string  diggStore = "Unknown";
                string  linkPrefix;
                string  linkSuffix;
                string  couponText;
                string  storeURL;
                int     thumbs;
                bool    active;
                string  searchTerms;
                DateTime dateAdded;
                string  keywords;
                string  slug;
                string  productId;
                string  imageLg;
                bool    hoody;
                string  imageHoody;
                bool    nonShirt;
                
                while (rdr.Read())
                {
                    diggID = Convert.ToInt32(rdr["DiggID"]);
                    image = rdr["Image"].ToString();
                    link = rdr["Link"].ToString();
                    title = rdr["Title"].ToString();
                    if (title == "") title = varConst.cSiteName + " Shirt";
                    diggStoreId = Convert.ToInt32(rdr["DiggStoreID"]);

                    SqlCommand cmdStore = new SqlCommand();
                    cmdStore.Connection = varConst.conn;
                    cmdStore.CommandType = CommandType.Text;
                    SqlParameter parameter = new SqlParameter();
                    parameter.ParameterName = "@DiggStoreId";
                    parameter.SqlDbType = SqlDbType.Int;
                    parameter.Direction = ParameterDirection.Input;
                    parameter.Value = diggStoreId;
                    cmdStore.CommandText = "SELECT * FROM tblDiggStore WHERE DiggStoreID = @DiggStoreId";
                    cmdStore.Parameters.Add(parameter);
                    SqlDataReader rdrStore = cmdStore.ExecuteReader();
                    
                    thumbs = Convert.ToInt32(rdr["Thumbs"]);
                    active = Convert.ToBoolean(rdr["Active"]);
                    searchTerms = Test(rdr["SearchTerms"].ToString());
                    if (!(rdr["DateAdded"] is DBNull))
                    {
                        dateAdded = Convert.ToDateTime(rdr["DateAdded"]);
                    } else {
                        dateAdded = Convert.ToDateTime("01/01/2014");
                    }
                    keywords = Test(rdr["Keywords"].ToString());
                    slug = Test(rdr["Slug"].ToString());
                    productId = Test(rdr["ProductID"].ToString());
                    imageLg = Test(rdr["ImageLg"].ToString());
                    if (!(rdr["Hoody"] is DBNull))
                    {
                        hoody = Convert.ToBoolean(rdr["Hoody"]);
                    }
                    else
                    {
                        hoody = false;
                    }
                    imageHoody = rdr["ImageHoody"].ToString();            
                    nonShirt = Convert.ToBoolean(rdr["NonShirt"]);

                    strJSON.Append("{");
                    strJSON.Append("\"diggId\":" + diggID + ",");
                    strJSON.Append("\"image\":\"" + image + "\",");
                    strJSON.Append("\"link\":\"" + link + "\",");
                    strJSON.Append("\"title\":\"" + title + "\",");
                    strJSON.Append("\"diggStoreId\":" + diggStoreId + ",");
                    strJSON.Append("\"vendor\":{");
                    if (rdrStore.Read())
                    {
                        diggStore = Test(rdrStore["DiggStore"].ToString());
                        linkPrefix = Test(rdrStore["LinkPrefix"].ToString());
                        linkSuffix = Test(rdrStore["LinkSuffix"].ToString());
                        couponText = System.Web.HttpUtility.HtmlEncode(rdrStore["CouponText"].ToString().Replace(@"""", @"\""") );
                        storeURL = Test(rdrStore["URL"].ToString());
                        strJSON.Append("\"diggStore\":\"" + diggStore + "\",");
                        strJSON.Append("\"linkPrefix\":\"" + linkPrefix + "\",");
                        strJSON.Append("\"linkSuffix\":\"" + linkSuffix + "\",");
                        strJSON.Append("\"couponText\":\"" + couponText + "\",");
                        strJSON.Append("\"storeURL\":\"" + storeURL + "\"");
                    }
                    
                    strJSON.Append("},\n\n");
                    strJSON.Append("\"thumbs\":" + thumbs + ",");
                    strJSON.Append("\"active\":" + active.ToString().ToLower() + ",");
                    strJSON.Append("\"searchTerms\":\"" + searchTerms + "\",");
                    strJSON.Append("\"dateAdded\":\"" + dateAdded + "\",");
                    strJSON.Append("\"keywords\":\"" + keywords + "\",");
                    strJSON.Append("\"slug\":\"" + slug + "\",");
                    strJSON.Append("\"productId\":\"" + productId + "\",");
                    strJSON.Append("\"imageLg\":\"" + imageLg + "\",");
                    strJSON.Append("\"hoody\":" + hoody.ToString().ToLower() + ",");
                    strJSON.Append("\"imageHoody\":\"" + imageHoody + "\",");
                    strJSON.Append("\"nonShirt\":\"" + nonShirt.ToString().ToLower() + "\",");
                    strJSON.Append("\"tags\":[");

                    SqlCommand cmd_tag = new SqlCommand();
                    cmd_tag.Connection = varConst.conn;
                    cmd_tag.CommandType = CommandType.StoredProcedure;
                    cmd_tag.CommandText = "usp_JSON_Tags";
                    cmd_tag.Parameters.Add("@DiggID", System.Data.SqlDbType.Int);
                    cmd_tag.Parameters["@DiggID"].Value = diggID;

                    SqlDataReader rdr_tag = cmd_tag.ExecuteReader();
                    if (rdr_tag.Read())
                    {
                        string tag;
                        string tagSlug;
                        bool loop = true;

                        while (loop) {
                            tag = rdr_tag["Tag"].ToString();
                            tagSlug = rdr_tag["Slug"].ToString();
                            loop = rdr_tag.Read();
                            if (!loop)
                            {
                                strJSON.Append("{");
                                strJSON.Append("\"tag\":\"" + tag + "\",");
                                strJSON.Append("\"tagSlug\":\"" + tagSlug + "\"");
                                strJSON.Append("}");
                            }
                            else
                            {
                                strJSON.Append("{");
                                strJSON.Append("\"tag\":\"" + tag + "\",");
                                strJSON.Append("\"tagSlug\":\"" + tagSlug + "\"");
                                strJSON.Append("}");
                                strJSON.Append(",");
                            }
                        }
                    }
                    rdr_tag.Close();
                    strJSON.Append("]},\n\n");
                }

                JSON.Text = strJSON.ToString();
            }
            rdr.Close();
    }
  }
}