<%@ Page Title="Site Map" Language="C#" MasterPageFile="~/DampTShirts.master" AutoEventWireup="true" CodeFile="json.aspx.cs" Inherits="json" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" Runat="Server"></asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
  <div class="main clearfix">
    <div class="main_left">
      <div class="module_1 b_margin_10">
        <div class="module_inner"><%= varConst.cRightColBanner_1 %></div>
      </div>
      <div class="module_1">
        <div class="module_inner">          
          <a target="_blank" href="http://www.shareasale.com/r.cfm?b=202882&amp;u=323844&amp;m=5108&amp;urllink=www.bustedtees.com&amp;afftrack=DampBanner"><img src="http://www.shareasale.com/image/5108/160natasha.jpg" alt="BustedTees - But 2, Get 1 Free" border="0" /></a>
        </div>
      </div>
    </div>
		<div class="main_right">
      <h1>Json</h1>
      <asp:literal runat="server" ID="JSON" />
    </div>
  </div>
</asp:Content>

