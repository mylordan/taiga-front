import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import * as actions from "./projects.actions";
import * as Immutable from "immutable";
import { ResourcesService } from "../resources/resources.service";
import { SetUserProjectsAction } from "./projects.actions"

@Injectable()
export class CurrentProjectsEffects {
    @Effect()
    fetchCurrentProject$: Observable<Action> = this.actions$
        .ofType('FETCH_CURRENT_PROJECT')
        .map(toPayload)
        .switchMap(projectSlug => {
          return this.rs.projects.getProjectBySlug(projectSlug)
              .map(project => new actions.SetCurrentProjectAction(Immutable.fromJS(project)));
        });

    @Effect()
    fetchUserProjects$: Observable<Action> = this.actions$
        .ofType('FETCH_USER_PROJECTS')
        .map(toPayload)
        .switchMap(userId => this.rs.projects.getProjectsByUserId(userId))
        .map((projects) => new SetUserProjectsAction(projects));

    constructor(private actions$: Actions, private rs: ResourcesService) { }
}
