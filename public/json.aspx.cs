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
  public class Shirt
  {
      public int diggID { get; set; }
      public string image { get; set; }
      public string link { get; set; }
      public string title { get; set; }
      public int diggStoreID { get; set; }
      public int thumbs { get; set; }
      public bool active { get; set; }
      public string searchTerms { get; set; }
      public DateTime dateAdded { get; set; }
      public string keywords { get; set; }
      public string slug { get; set; }
      public string productID { get; set; }
      public string imageLg { get; set; }
      public bool hoody { get; set; }
      public string imageHoody { get; set; }
      public bool nonShirt { get; set; }
      public object tags { get; set; }
      
  }
  public class Tag
  {
      public string tag { get; set; }
      public string tag_slug { get; set; }
  }
  //public object tagJSON;
  //public object objTag;
  protected void Page_Load(object sender, EventArgs e)
  {
      object ResultList = "";
      String TagList = "";
      JavaScriptSerializer jsSerializer = new JavaScriptSerializer();

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
                List<Shirt> shirtsList = new List<Shirt>();
                int     diggID;
                string  image;
                string  link;
                string  title;
                int     diggStoreID;
                int     thumbs;
                bool    active;
                string  searchTerms;
                DateTime dateAdded;
                string  keywords;
                string  slug;
                string  productID;
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
                    if (title == "") title = varConst.cSiteName + "-shirt";
                    diggStoreID = Convert.ToInt32(rdr["DiggStoreID"]);
                    thumbs = Convert.ToInt32(rdr["Thumbs"]);
                    active = Convert.ToBoolean(rdr["Active"]);
                    searchTerms = rdr["SearchTerms"].ToString();
                    if (!(rdr["DateAdded"] is DBNull))
                    {
                        dateAdded = Convert.ToDateTime(rdr["DateAdded"]);
                    } else {
                        dateAdded = Convert.ToDateTime("01/01/2014");
                    }
                    keywords = rdr["Keywords"].ToString();
                    slug = rdr["Slug"].ToString();
                    productID = rdr["ProductID"].ToString();
                    imageLg = rdr["ImageLg"].ToString();
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

                    Shirt objShirt = new Shirt();

                    SqlCommand cmd_tag = new SqlCommand();
                    cmd_tag.Connection = varConst.conn;
                    cmd_tag.CommandType = CommandType.StoredProcedure;
                    cmd_tag.CommandText = "usp_JSON_Tags";
                    cmd_tag.Parameters.Add("@DiggID", System.Data.SqlDbType.Int);
                    cmd_tag.Parameters["@DiggID"].Value = diggID;

                    SqlDataReader rdr_tag = cmd_tag.ExecuteReader();
                    if (rdr_tag.HasRows)
                    {
                        List<Tag> tagList = new List<Tag>();
                        string tag;
                        string tag_slug;

                        while (rdr_tag.Read()) {
                            Tag objTag = new Tag();
                            tag = rdr_tag["Tag"].ToString();
                            tag_slug = rdr_tag["Slug"].ToString();

                            objTag.tag = tag;
                            objTag.tag_slug = tag_slug;

                            tagList.Add(objTag);
                        }
                        TagList = jsSerializer.Serialize(tagList);
                    }
                    rdr_tag.Close();

                    objShirt.diggID =       diggID;
                    objShirt.image =        image;
                    objShirt.link =         link;
                    objShirt.title =        title;
                    objShirt.diggStoreID =  diggStoreID;
                    objShirt.thumbs =       thumbs;
                    objShirt.active =       active;
                    objShirt.searchTerms =  searchTerms;
                    objShirt.dateAdded =    dateAdded;
                    objShirt.keywords =     keywords;
                    objShirt.slug =         slug;
                    objShirt.productID =    productID;
                    objShirt.imageLg =      imageLg;
                    objShirt.hoody =        hoody;
                    objShirt.imageHoody =   imageHoody;
                    objShirt.nonShirt =     nonShirt;
                    objShirt.tags =         TagList;
                    shirtsList.Add(objShirt);
                    TagList = null;
                }
                
                ResultList = jsSerializer.Serialize(shirtsList).ToString();

                JSON.Text = ResultList.ToString();
            }
            rdr.Close();
    }
  }
}