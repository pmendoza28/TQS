import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { CredServices } from '../../services/cred.service';
import { SidebarServices } from './sidebar.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(
    public sideBarServices: SidebarServices,
    public credServices: CredServices,
    private router: Router
    
  ) { 
    this.dataSource.data = TREE_DATA;
  }

  isExpanded = true;
  showSubMenu: boolean = false;
  isShowing = false;

  

  checkAccess(accessParam: string) {
    let { user: { access_permission } } = this.credServices.getCredentials()
    let hasAccess = access_permission.some((access: string) => access == accessParam)
    return hasAccess
  }

  goTo(route: any) {
    this.router.navigate([route])
  }


  private _transformer = (node: any, level: any) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      route: node.route,
      selectedCss: node.selectedCss,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<any>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
  hasChild = (_: number, node: any) => node.expandable;

}


const TREE_DATA: any[] = [
  {
    name: 'Master-list',
    children: [
      { name: 'User-Accounts', route: '/admin/user-accounts', selectedCss: 'user-accounts' }, 
      { name: 'Stores', route: '/admin/stores', selectedCss: 'stores' }, 
      { name: 'Members', route: '/admin/members', selectedCss: 'members' }
    ],
  },
  {
    name: 'Transactions',
    children: [
      { name: 'Earned Points' }, 
      { name: 'Redeemed Points' }
    ],
  },
];

