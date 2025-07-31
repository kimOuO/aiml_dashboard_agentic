interface NavigationStep {
  type: 'navigate' | 'action' | 'wait' | 'instruction';
  label: string;
  description: string;
  target_url?: string;
  target_element?: string;
  action?: string;
  confirmation?: string;
  wait_for_user_action: boolean;
  selection_required?: boolean;
  entity_type?: string;
}

interface NavigationTarget {
  destination: string;
  action?: string;
  entity_ids?: {
    projectName?: string;
    projectUID?: string;
    applicationName?: string;
    applicationUID?: string;
    [key: string]: string | undefined;
  };
}

interface RouteNode {
  path: string;
  requiresSelection?: boolean;
  entityType?: string;
  actions?: string[];
  children?: Record<string, RouteNode>;
}

class NavigationRoutingService {
  private static instance: NavigationRoutingService;
  private routeTree: Record<string, RouteNode> = {};

  private constructor() {
    this.buildRouteTree();
  }

  public static getInstance(): NavigationRoutingService {
    if (!NavigationRoutingService.instance) {
      NavigationRoutingService.instance = new NavigationRoutingService();
    }
    return NavigationRoutingService.instance;
  }

  private buildRouteTree() {
    this.routeTree = {
      'projects': {
        path: '/projects',
        requiresSelection: true,
        entityType: 'Project',
        actions: ['create', 'edit', 'delete'],
        children: {
          '[projectName]': {
            path: '/projects/[projectName]',
            children: {
              'datasets': {
                path: '/projects/[projectName]/datasets',
                actions: ['create', 'edit', 'delete', 'download']
              },
              'applications': {
                path: '/projects/[projectName]/applications',
                requiresSelection: true,
                entityType: 'Application',
                actions: ['create', 'edit', 'delete'],
                children: {
                  '[appName]': {
                    path: '/projects/[projectName]/applications/[appName]',
                    children: {
                      'dashboard': {
                        path: '/projects/[projectName]/applications/[appName]/dashboard',
                        children: {
                          'preprocessing_pipeline': {
                            path: '/projects/[projectName]/applications/[appName]/dashboard/preprocessing_pipeline',
                            actions: ['create', 'edit', 'delete', 'download'],
                            children: {
                              '[pipeName]': {
                                path: '/projects/[projectName]/applications/[appName]/dashboard/preprocessing_pipeline/[pipeName]',
                                children: {
                                  'build_file': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/preprocessing_pipeline/[pipeName]/build_file',
                                    actions: ['create', 'edit', 'delete', 'download']
                                  },
                                  'config': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/preprocessing_pipeline/[pipeName]/config',
                                    actions: ['create', 'edit', 'delete']
                                  },
                                  'tasks': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/preprocessing_pipeline/[pipeName]/tasks',
                                    actions: ['create', 'edit', 'delete']
                                  }
                                }
                              }
                            }
                          },
                          'training_pipeline': {
                            path: '/projects/[projectName]/applications/[appName]/dashboard/training_pipeline',
                            actions: ['create', 'edit', 'delete', 'download'],
                            children: {
                              '[pipeName]': {
                                path: '/projects/[projectName]/applications/[appName]/dashboard/training_pipeline/[pipeName]',
                                children: {
                                  'build_file': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/training_pipeline/[pipeName]/build_file',
                                    actions: ['create', 'edit', 'delete', 'download']
                                  },
                                  'config': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/training_pipeline/[pipeName]/config',
                                    actions: ['create', 'edit', 'delete']
                                  },
                                  'tasks': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/training_pipeline/[pipeName]/tasks',
                                    actions: ['create', 'edit', 'delete']
                                  }
                                }
                              }
                            }
                          },
                          'evaluation_pipeline': {
                            path: '/projects/[projectName]/applications/[appName]/dashboard/evaluation_pipeline',
                            actions: ['create', 'edit', 'delete', 'download'],
                            children: {
                              '[pipeName]': {
                                path: '/projects/[projectName]/applications/[appName]/dashboard/evaluation_pipeline/[pipeName]',
                                children: {
                                  'build_file': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/evaluation_pipeline/[pipeName]/build_file',
                                    actions: ['create', 'edit', 'delete', 'download']
                                  },
                                  'config': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/evaluation_pipeline/[pipeName]/config',
                                    actions: ['create', 'edit', 'delete']
                                  },
                                  'tasks': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/evaluation_pipeline/[pipeName]/tasks',
                                    actions: ['create', 'edit', 'delete']
                                  }
                                }
                              }
                            }
                          },
                          'optimization_pipeline': {
                            path: '/projects/[projectName]/applications/[appName]/dashboard/optimization_pipeline',
                            actions: ['create', 'edit', 'delete', 'download'],
                            children: {
                              '[pipeName]': {
                                path: '/projects/[projectName]/applications/[appName]/dashboard/optimization_pipeline/[pipeName]',
                                children: {
                                  'build_file': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/optimization_pipeline/[pipeName]/build_file',
                                    actions: ['create', 'edit', 'delete', 'download']
                                  },
                                  'config': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/optimization_pipeline/[pipeName]/config',
                                    actions: ['create', 'edit', 'delete']
                                  },
                                  'tasks': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/optimization_pipeline/[pipeName]/tasks',
                                    actions: ['create', 'edit', 'delete']
                                  }
                                }
                              }
                            }
                          },
                          'optimization_datasets': {
                            path: '/projects/[projectName]/applications/[appName]/dashboard/optimization_datasets',
                            actions: ['create', 'edit', 'delete', 'download']
                          },
                          'raw_data': {
                            path: '/projects/[projectName]/applications/[appName]/dashboard/raw_data',
                            actions: ['create', 'edit', 'delete', 'download']
                          },
                          'model': {
                            path: '/projects/[projectName]/applications/[appName]/dashboard/model',
                            actions: ['create', 'edit', 'delete', 'download'],
                            children: {
                              '[modelName]': {
                                path: '/projects/[projectName]/applications/[appName]/dashboard/model/[modelName]',
                                children: {
                                  'tuning_model': {
                                    path: '/projects/[projectName]/applications/[appName]/dashboard/model/[modelName]/tuning_model',
                                    actions: ['create', 'edit', 'delete']
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      'agents': {
        path: '/agents',
        requiresSelection: true,
        entityType: 'Agent',
        actions: ['create', 'edit', 'delete'],
        children: {
          '[agentName]': {
            path: '/agents/[agentName]',
            children: {
              'link_application': {
                path: '/agents/[agentName]/link_application',
                actions: ['create', 'edit', 'delete']
              }
            }
          }
        }
      }
    };
  }

  public generateNavigationSteps(
    currentPath: string, 
    currentParams: Record<string, string>,
    target: NavigationTarget
  ): NavigationStep[] {
    const steps: NavigationStep[] = [];
    const targetPath = this.parseTargetPath(target.destination);
    const currentSegments = this.parseTargetPath(currentPath);
    
    // Find divergence point
    const divergenceIndex = this.findDivergencePoint(currentSegments, targetPath);
    
    // Generate navigation steps based on UI flow
    this.generateUIFlowSteps(steps, targetPath, currentParams, target, divergenceIndex);

    // Add action step if specified
    if (target.action) {
      steps.push(this.generateActionStep(target.action, targetPath));
    }

    return steps;
  }

  private generateUIFlowSteps(
    steps: NavigationStep[],
    targetPath: string[],
    currentParams: Record<string, string>,
    target: NavigationTarget,
    divergenceIndex: number
  ) {
    let needsProjectsPage = false;
    let needsProjectSelection = false;
    let needsApplicationSelection = false;
    let finalDestination = '';

    // Analyze the target path to determine UI flow
    if (targetPath.includes('projects')) {
      const projectIndex = targetPath.indexOf('projects');
      const applicationsIndex = targetPath.indexOf('applications');
      
      // Always need to go to projects page and select project for project-related navigation
      needsProjectsPage = true;
      needsProjectSelection = true;
      
      // Check if we need application selection
      if (applicationsIndex !== -1) {
        needsApplicationSelection = true;
        
        // Build final destination after app selection
        const pathAfterApp = targetPath.slice(applicationsIndex + 2); // Skip 'applications' and '[appName]'
        if (pathAfterApp.length > 0) {
          finalDestination = pathAfterApp.join('/');
        }
      } else {
        // Going to project-level page (like datasets)
        const pathAfterProject = targetPath.slice(projectIndex + 2); // Skip 'projects' and '[projectName]'
        if (pathAfterProject.length > 0) {
          finalDestination = pathAfterProject.join('/');
        }
      }
    } else if (targetPath.includes('agents')) {
      needsProjectsPage = false;
      steps.push({
        type: 'navigate',
        label: 'Go to Agents',
        description: 'Navigate to agents page',
        target_url: this.buildURL(['agents'], currentParams, target.entity_ids),
        confirmation: 'Ready to go to Agents page?',
        wait_for_user_action: true
      });
      
      if (targetPath.length > 1) {
        steps.push({
          type: 'wait',
          label: 'Select Agent',
          description: 'Select the agent from the list',
          wait_for_user_action: true,
          selection_required: true,
          entity_type: 'Agent'
        });
      }
      return;
    }

    // Generate steps based on analysis
    if (needsProjectsPage) {
      steps.push({
        type: 'navigate',
        label: 'Go to Projects',
        description: 'Navigate to projects page to select your project',
        target_url: this.buildURL(['projects'], currentParams, target.entity_ids),
        confirmation: 'Ready to go to Projects page?',
        wait_for_user_action: true
      });
    }

    if (needsProjectSelection) {
      if (needsApplicationSelection) {
        // Going to application-related features
        steps.push({
          type: 'wait',
          label: 'Select Project Applications',
          description: 'Find your project card and click the blue "Applications" button (not the card itself) to view applications',
          wait_for_user_action: true,
          selection_required: true,
          entity_type: 'Project'
        });
      } else if (finalDestination === 'datasets') {
        // Going to project datasets
        steps.push({
          type: 'wait',
          label: 'Select Project Datasets',
          description: 'Find your project card and click the "Datasets" button to view project datasets',
          wait_for_user_action: true,
          selection_required: true,
          entity_type: 'Project'
        });
      } else {
        // Generic project selection
        steps.push({
          type: 'wait',
          label: 'Select Project',
          description: 'Find your project card and click the appropriate button to access project features',
          wait_for_user_action: true,
          selection_required: true,
          entity_type: 'Project'
        });
      }
    }

    if (needsApplicationSelection) {
      steps.push({
        type: 'wait',
        label: 'Select Application',
        description: 'Click on your application card to access the dashboard',
        wait_for_user_action: true,
        selection_required: true,
        entity_type: 'Application'
      });

      // Navigate to specific feature within the application dashboard
      if (finalDestination && finalDestination !== 'dashboard') {
        // Handle complex paths like 'dashboard/training_pipeline'
        const destinationParts = finalDestination.split('/');
        let featureName = '';
        
        // Extract the main feature name
        if (destinationParts.includes('training_pipeline')) {
          featureName = 'Training Pipeline';
        } else if (destinationParts.includes('preprocessing_pipeline')) {
          featureName = 'Preprocessing Pipeline';
        } else if (destinationParts.includes('evaluation_pipeline')) {
          featureName = 'Evaluation Pipeline';
        } else if (destinationParts.includes('optimization_pipeline')) {
          featureName = 'Optimization Pipeline';
        } else if (destinationParts.includes('optimization_datasets')) {
          featureName = 'Optimization Datasets';
        } else if (destinationParts.includes('raw_data')) {
          featureName = 'Raw Data';
        } else if (destinationParts.includes('model')) {
          featureName = 'Models';
        } else {
          // Use the last part of the destination
          featureName = this.getPageLabel(destinationParts[destinationParts.length - 1]);
        }
        
        steps.push({
          type: 'wait',
          label: `Go to ${featureName}`,
          description: `On the dashboard, click the '${featureName}' section to access ${featureName.toLowerCase()} features`,
          wait_for_user_action: true
        });
      }
    }
  }

  private parseTargetPath(destination: string): string[] {
    return destination.split('/').filter(segment => segment.length > 0);
  }

  private findDivergencePoint(current: string[], target: string[]): number {
    for (let i = 0; i < Math.min(current.length, target.length); i++) {
      if (current[i] !== target[i] && !this.isDynamicSegment(current[i], target[i])) {
        return i;
      }
    }
    return Math.min(current.length, target.length);
  }

  private isDynamicSegment(current: string, target: string): boolean {
    return (current.startsWith('[') && current.endsWith(']')) ||
           (target.startsWith('[') && target.endsWith(']')) ||
           /^[a-zA-Z0-9%_-]+$/.test(current); // Likely encoded dynamic segment
  }

  private findRouteNode(pathSegments: string[]): RouteNode | null {
    let current = this.routeTree;
    let node: RouteNode | null = null;

    for (const segment of pathSegments) {
      // Try exact match first
      if (current[segment]) {
        node = current[segment];
        current = node.children || {};
      } 
      // Try dynamic route match
      else {
        const dynamicKey = Object.keys(current).find(key => 
          key.startsWith('[') && key.endsWith(']')
        );
        
        if (dynamicKey && current[dynamicKey]) {
          node = current[dynamicKey];
          current = node.children || {};
        } else {
          return null;
        }
      }
    }

    return node;
  }

  private generateEntitySelectionStep(
    routeNode: RouteNode | null, 
    entityIds?: Record<string, string>,
    currentSegment?: string
  ): NavigationStep {
    // Determine entity type from route node or segment
    let entityType = routeNode?.entityType;
    
    if (!entityType && currentSegment?.startsWith('[') && currentSegment?.endsWith(']')) {
      const paramName = currentSegment.slice(1, -1);
      entityType = this.getEntityTypeFromParam(paramName);
    }
    
    entityType = entityType || 'Item';
    
    return {
      type: 'wait',
      label: `Select ${entityType}`,
      description: this.getSelectionDescription(entityType),
      wait_for_user_action: true,
      selection_required: true,
      entity_type: entityType
    };
  }

  private getEntityTypeFromParam(paramName: string): string {
    const paramMap: Record<string, string> = {
      'projectName': 'Project',
      'appName': 'Application',
      'agentName': 'Agent',
      'modelName': 'Model',
      'pipeName': 'Pipeline',
      'datasetName': 'Dataset'
    };
    
    return paramMap[paramName] || 'Item';
  }

  private getSelectionDescription(entityType: string): string {
    const descriptions: Record<string, string> = {
      'Project': 'Find your project card and click the blue "Applications" button (not the card itself)',
      'Application': 'Click on your application card to access the dashboard',
      'Agent': 'Select the agent from the list',
      'Dataset': 'Choose the dataset you want to work with',
      'Model': 'Select the model from the available options',
      'Pipeline': 'Choose the pipeline you want to configure'
    };

    return descriptions[entityType] || `Select the ${entityType.toLowerCase()} from the list`;
  }

  private generateNavigationStep(pathSegments: string[], url: string): NavigationStep {
    const lastSegment = pathSegments[pathSegments.length - 1];
    const pageLabel = this.getPageLabel(lastSegment);
    
    return {
      type: 'navigate',
      label: `Go to ${pageLabel}`,
      description: `Navigate to ${pageLabel} page`,
      target_url: url,
      confirmation: `Ready to go to ${pageLabel}?`,
      wait_for_user_action: true
    };
  }

  private getPageLabel(segment: string): string {
    const labels: Record<string, string> = {
      'projects': 'Projects',
      'applications': 'Applications',
      'dashboard': 'Dashboard',
      'preprocessing_pipeline': 'Preprocessing Pipeline',
      'training_pipeline': 'Training Pipeline',
      'evaluation_pipeline': 'Evaluation Pipeline',
      'optimization_pipeline': 'Optimization Pipeline',
      'optimization_datasets': 'Optimization Datasets',
      'raw_data': 'Raw Data',
      'model': 'Models',
      'agents': 'Agents',
      'datasets': 'Datasets',
      'tasks': 'Tasks',
      'config': 'Config',
      'build_file': 'Build Files',
      'tuning_model': 'Model Tuning',
      'link_application': 'Link Application'
    };

    if (labels[segment]) {
      return labels[segment];
    }

    // Handle dynamic segments
    if (segment.startsWith('[') && segment.endsWith(']')) {
      const paramName = segment.slice(1, -1);
      return paramName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    return segment.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private buildURL(
    pathSegments: string[], 
    currentParams: Record<string, string>,
    entityIds?: Record<string, string>
  ): string {
    // For projects page, just return the base URL
    let url = '/' + pathSegments.join('/');

    const params = new URLSearchParams();

    // Add required parameters
    if (currentParams.organizationUID) {
      params.append('organizationUID', currentParams.organizationUID);
    }

    // Add entity-specific UID parameters
    if (entityIds) {
      Object.entries(entityIds).forEach(([key, value]) => {
        if (value && key.endsWith('UID')) {
          params.append(key, value);
        }
      });
    }

    return params.toString() ? `${url}?${params.toString()}` : url;
  }

  private generateActionStep(action: string, pathSegments: string[]): NavigationStep {
    const actionLabels: Record<string, string> = {
      'create': 'Create New Item',
      'edit': 'Edit Item',
      'delete': 'Delete Item',
      'download': 'Download Item'
    };

    const actionSelectors: Record<string, string> = {
      'create': 'button.bg-green-800, button[class*="bg-green"]',
      'edit': 'button[title="Edit"], .edit-button',
      'delete': 'button[title="Delete"], .delete-button',
      'download': 'button[title="Download"], .download-button'
    };

    return {
      type: 'action',
      label: actionLabels[action] || `${action} Item`,
      description: `Click the ${action} button to perform the action`,
      target_element: actionSelectors[action] || `button[data-action="${action}"]`,
      action: 'click',
      wait_for_user_action: true
    };
  }
}

export const navigationService = NavigationRoutingService.getInstance();
export type { NavigationStep, NavigationTarget };