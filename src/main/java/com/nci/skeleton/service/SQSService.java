package com.nci.skeleton.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;
import software.amazon.awssdk.services.sqs.model.SendMessageResponse;

@Service
public class SQSService {

    @Autowired
    AwsSessionCredentials awsSessionCredentials;
    private static final String QUEUE_URL = "https://sqs.eu-central-1.amazonaws.com/250738637992/email_queue"; // Replace with your SQS Queue URL

    public String sendSqsMessage(String messageBody) {
        try (SqsClient sqsClient = SqsClient.builder()
                .region(Region.EU_CENTRAL_1) // Replace with your region
                .credentialsProvider(StaticCredentialsProvider.create(awsSessionCredentials))  // Use default credentials (SSO included)
                .build()) {

            SendMessageRequest sendMessageRequest = SendMessageRequest.builder()
                    .queueUrl(QUEUE_URL)
                    .messageBody(messageBody)
                    .build();

            // Send the message to the SQS queue
            SendMessageResponse sendMessageResponse = sqsClient.sendMessage(sendMessageRequest);

            // Optionally, you can log or return the message ID or other details
            return sendMessageResponse.messageId();

        } catch (Exception e) {
            // Handle the exception or rethrow it
            throw new RuntimeException("Failed to send message to SQS", e);
        }
    }

    public String sendEmailMessage(String messageBody) {
        try (SqsClient sqsClient = SqsClient.builder()
                .region(Region.EU_CENTRAL_1) // Replace with your region
                .credentialsProvider(StaticCredentialsProvider.create(awsSessionCredentials))  // Use default credentials (SSO included)
                .build()) {

            SendMessageRequest sendMessageRequest = SendMessageRequest.builder()
                    .queueUrl(QUEUE_URL)
                    .messageBody(messageBody)
                    .build();

            // Send the message to the SQS queue
            SendMessageResponse sendMessageResponse = sqsClient.sendMessage(sendMessageRequest);

            // Optionally, you can log or return the message ID or other details
            return sendMessageResponse.messageId();

        } catch (Exception e) {
            // Handle the exception or rethrow it
            throw new RuntimeException("Failed to send message to SQS", e);
        }
    }
}