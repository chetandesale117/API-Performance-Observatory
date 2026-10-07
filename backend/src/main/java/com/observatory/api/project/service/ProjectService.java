package com.observatory.api.project.service;

import com.observatory.api.project.dto.ProjectRequest;
import com.observatory.api.project.dto.ProjectResponse;
import com.observatory.api.project.entity.Project;
import com.observatory.api.project.repository.ProjectRepository;
import com.observatory.api.shared.exception.ResourceNotFoundException;
import com.observatory.api.shared.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsForUser(UUID userId) {
        return projectRepository.findByOwnerIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toProjectResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(UUID id, UUID userId) {
        Project project = getProjectAndValidateOwner(id, userId);
        return toProjectResponse(project);
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, UUID userId) {
        Project project = new Project();
        project.setName(request.name());
        project.setDescription(request.description());
        project.setOwnerId(userId);

        Project savedProject = projectRepository.save(project);
        return toProjectResponse(savedProject);
    }

    @Transactional
    public ProjectResponse updateProject(UUID id, ProjectRequest request, UUID userId) {
        Project project = getProjectAndValidateOwner(id, userId);
        project.setName(request.name());
        project.setDescription(request.description());

        Project updatedProject = projectRepository.save(project);
        return toProjectResponse(updatedProject);
    }

    @Transactional
    public void deleteProject(UUID id, UUID userId) {
        Project project = getProjectAndValidateOwner(id, userId);
        projectRepository.delete(project);
    }

    public Project getProjectAndValidateOwner(UUID id, UUID userId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        if (!project.getOwnerId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this project");
        }
        return project;
    }

    private ProjectResponse toProjectResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getOwnerId(),
                project.getCollections() != null ? project.getCollections().size() : 0,
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}
